import json
import os
from typing import Any, Dict, Type
from google import genai# your config values
from pydantic import BaseModel, Field
from typing import List, Dict, Any



GENAI_API_KEY = None
GENAI_API_KEY = None
secret_path = "/run/secrets/genai_api_key"
if os.path.exists(secret_path):
    with open(secret_path, "r") as f:
        GENAI_API_KEY = f.read().strip()
else:
    GENAI_API_KEY = os.getenv("GENAI_API_KEY", "AIzaSyCXCoRFzF-Tdyir9ICQTKx3HpUBPHq5xBg")



GENAI_MODEL = os.getenv("GENAI_MODEL", "gemini-1.5-pro")
# Examples used for study-schedule prompt (kept small and predictable)
EXAMPLE_1 = '{"userId":"1","exams":[{"id":"1234","courseName":"Math","ects":6,"examDateTime":"2025-03-10T09:00:00","durationMinutes":120}]}'
EXAMPLE_1_OUT = '{"userId":"1","timeSlots":[{"examId":"1234","title":"Study Math","startTime":"2025-02-01T10:00:00","endTime":"2025-02-01T12:00:00"}]}'

EXAMPLE_2 = '{"userId":"2","exams":[{"id":"201","courseName":"Algorithms","ects":7,"examDateTime":"2025-04-05T10:00:00","durationMinutes":180},{"id":"202","courseName":"Databases","ects":6,"examDateTime":"2025-04-12T09:00:00","durationMinutes":120}]}'
EXAMPLE_2_OUT = '{"userId":"2","timeSlots":[{"examId":"201","title":"Study Algorithms","startTime":"2025-03-01T09:00:00","endTime":"2025-03-01T12:00:00"},{"examId":"202","title":"Study Databases","startTime":"2025-03-02T14:00:00","endTime":"2025-03-02T16:00:00"}]}'

EXAMPLE_3 = '{"userId":"3","exams":[{"id":"301","courseName":"Operating Systems","ects":8,"examDateTime":"2025-05-18T13:00:00","durationMinutes":150}]}'
EXAMPLE_3_OUT = '{"userId":"3","timeSlots":[{"examId":"301","title":"Study Operating Systems","startTime":"2025-04-10T10:00:00","endTime":"2025-04-10T13:00:00"}]}'

EXAMPLE_4 = '{"userId":"4","exams":[{"id":"401","courseName":"Linear Algebra","ects":5,"examDateTime":"2025-06-02T09:00:00","durationMinutes":120}]}'
EXAMPLE_4_OUT = '{"userId":"4","timeSlots":[{"examId":"401","title":"Study Linear Algebra","startTime":"2025-05-01T08:00:00","endTime":"2025-05-01T10:00:00"}]}'


class _HealthCheckSchema(BaseModel):
    ping: str

class GoogleClient:
    def __init__(self, model: str = "gemini-2.5-flash"):
        self.client = genai.Client(api_key=GENAI_API_KEY)
        self.model = model or GENAI_MODEL

    def process_json(self, input_json: dict, schema: Type[BaseModel]) -> dict:
        # Build the few-shot prompt with examples
        input_as_string = json.dumps(input_json, ensure_ascii=False)

        prompt = (
            
            "Now process this input as was illustrated in the example and the rules:\n" + input_as_string
        )
        SYSTEM_INSTRUCTION = (
            "You are given this JSON input. Process it and return a JSON-only response. "
            "You are to respond in the same format as the examples below.\n\n"
            "Example Input:\n" + EXAMPLE_1 + "\nExample Output:\n" + EXAMPLE_1_OUT + "\n\n"
            "Example Input:\n" + EXAMPLE_2 + "\nExample Output:\n" + EXAMPLE_2_OUT + "\n\n"
            "Example Input:\n" + EXAMPLE_3 + "\nExample Output:\n" + EXAMPLE_3_OUT + "\n\n"
            "Example Input:\n" + EXAMPLE_4 + "\nExample Output:\n" + EXAMPLE_4_OUT + "\n\n"
            "Some rules to follow:\n"
            "1. Always respond with valid JSON matching the specified schema.\n"
            "2. Ensure all date-time fields are in ISO 8601 format and that time is always a whole number. Eg. 10:30 is not accepted but 10:00 or 11:00 is.\n"
            "3. Do not include any explanations or additional text outside the JSON structure.\n"
        )

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config={
                "system_instruction": SYSTEM_INSTRUCTION,
                "response_mime_type": "application/json",
                "response_json_schema": schema.model_json_schema(),
                "temperature": 0,
            },
        )

        # This is already guaranteed JSON-shaped
        validated = schema.model_validate_json(response.text)
        return validated.model_dump()
        # return schema.model_validate_json(response.text).model_dump()
    
    def health_check(self) -> bool:
        """
        Returns True if: 
        - API is reachable
        - Model responds
        - JSON schema enforcement works
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents='{"ping":"pong"}',
                config={
                    "response_mime_type": "application/json",
                    "response_json_schema": _HealthCheckSchema.model_json_schema(),
                    "temperature": 0,
                },
            )

            parsed = _HealthCheckSchema.model_validate_json(response.text)
            return parsed.ping == "pong"

        except Exception:
            return False

