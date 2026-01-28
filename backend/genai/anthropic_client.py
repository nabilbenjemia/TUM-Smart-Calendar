import json
import os
from typing import Any, Dict
import openai
from google import genai
from config import OPENAI_API_KEY, OPENAI_MODEL, GENAI_API_KEY, GENAI_MODEL  # your config values
from pydantic import BaseModel, Field
from typing import List, Dict, Any


if openai is not None:
    openai.api_key = OPENAI_API_KEY

# Examples used for study-schedule prompt (kept small and predictable)
EXAMPLE_1 = '{"userId":"1","exams":[{"id":"1234","courseName":"Math","ects":6,"examDateTime":"2025-03-10T09:00:00","durationMinutes":120}]}'
EXAMPLE_1_OUT = '{"userId":"1","TimeSlot":[{"examId":"1234","title":"Study Math","startTime":"2025-02-01T10:00:00","endTime":"2025-02-01T12:00:00"}]}'

EXAMPLE_2 = '{"userId":"2","exams":[{"id":"201","courseName":"Algorithms","ects":7,"examDateTime":"2025-04-05T10:00:00","durationMinutes":180},{"id":"202","courseName":"Databases","ects":6,"examDateTime":"2025-04-12T09:00:00","durationMinutes":120}]}'
EXAMPLE_2_OUT = '{"userId":"2","TimeSlot":[{"examId":"201","title":"Study Algorithms","startTime":"2025-03-01T09:00:00","endTime":"2025-03-01T12:00:00"},{"examId":"202","title":"Study Databases","startTime":"2025-03-02T14:00:00","endTime":"2025-03-02T16:00:00"}]}'

EXAMPLE_3 = '{"userId":"3","exams":[{"id":"301","courseName":"Operating Systems","ects":8,"examDateTime":"2025-05-18T13:00:00","durationMinutes":150}]}'
EXAMPLE_3_OUT = '{"userId":"3","TimeSlot":[{"examId":"301","title":"Study Operating Systems","startTime":"2025-04-10T10:00:00","endTime":"2025-04-10T13:00:00"}]}'

EXAMPLE_4 = '{"userId":"4","exams":[{"id":"401","courseName":"Linear Algebra","ects":5,"examDateTime":"2025-06-02T09:00:00","durationMinutes":120}]}'
EXAMPLE_4_OUT = '{"userId":"4","TimeSlot":[{"examId":"401","title":"Study Linear Algebra","startTime":"2025-05-01T08:00:00","endTime":"2025-05-01T10:00:00"}]}'


class TimeSlotClass(BaseModel):
    examId: str = Field(description="ID of the exam")
    title: str = Field(description="Title of the study session")
    startTime: str = Field(description="ISO 8601 start time")
    endTime: str = Field(description="ISO 8601 end time")

class StudyPlanOutput(BaseModel):
    userId: str = Field(description="User identifier")
    TimeSlot: List[TimeSlotClass] = Field(
        description="Generated study time slots and Ensure all date-time fields are in ISO 8601 format and that time is always a whole number. Eg. 10:30 is not accepted but 10:00 or 11:00 is. "
    )

class _HealthCheckSchema(BaseModel):
    ping: str

class GoogleClient:
    def __init__(self, model: str = "gemini-2.5-flash"):
        self.client = genai.Client(api_key=GENAI_API_KEY)
        self.model = model or GENAI_MODEL

    def process_json(self, input_json: dict, schema: BaseModel) -> dict:
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

        # Use response_schema with the Pydantic class directly (not JSON schema dict)
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config={
                "system_instruction": SYSTEM_INSTRUCTION,
                "response_mime_type": "application/json",
                "response_schema": schema,
                "temperature": 0,
            },
        )

        # This is already guaranteed JSON-shaped
        print("GoogleClient response:", response.text)
        # return schema.model_validate_json(response.text).model_dump()
        return json.loads(response.text)
    
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
                    "response_schema": _HealthCheckSchema,
                    "temperature": 0,
                },
            )

            parsed = _HealthCheckSchema.model_validate_json(response.text)
            return parsed.ping == "pong"

        except Exception:
            return False

# class OpenAIClient:
#     def __init__(self, model: str = None):
#         self.model = model or OPENAI_MODEL

#     def process_json(self, input_json: Dict[str, Any]) -> Dict[str, Any]:
#         # Convert input JSON to string
#         input_as_string = json.dumps(input_json, ensure_ascii=False)

#         # Build the few-shot prompt with examples
#         prompt = (
#             "You are given this JSON input. Process it and return a JSON-only response. "
#             "You are to respond in the same format as the examples below.\n\n"
#             "Example Input:\n" + EXAMPLE_1 + "\nExample Output:\n" + EXAMPLE_1_OUT + "\n\n"
#             "Example Input:\n" + EXAMPLE_2 + "\nExample Output:\n" + EXAMPLE_2_OUT + "\n\n"
#             "Example Input:\n" + EXAMPLE_3 + "\nExample Output:\n" + EXAMPLE_3_OUT + "\n\n"
#             "Example Input:\n" + EXAMPLE_4 + "\nExample Output:\n" + EXAMPLE_4_OUT + "\n\n"
#             "Now process this input:\n" + input_as_string
#         )

#         # Call OpenAI Chat Completion API
#         response = openai.chat.completions.create(
#             model=self.model,
#             messages=[
#                 {"role": "system", "content": prompt},
#                 {"role": "user", "content": prompt}
#             ],
#             temperature=0
#         )

#         # Extract the response text
#         text = response.choices[0].message.content.strip()

#         # Try to parse as JSON, fallback to raw text
#         try:
#             return json.loads(text)
#         except json.JSONDecodeError:
#             return {"llm_raw": text}

#     # alias kept for backward compatibility with integration tests
#     def generate_study_schedule(self, input_json: Dict[str, Any]) -> Dict[str, Any]:
#         return self.process_json(input_json)

#     def health_check(self) -> bool:
#         """Check if OpenAI API works."""
#         try:
#             response = openai.chat.completions.create(
#                 model=self.model,
#                 messages=[{"role": "system", "content": "Respond with JSON: {\"ping\": \"pong\"}"}],
#                 temperature=0,
#                 max_tokens=10
#             )
#             text = response.choices[0].message.content.strip()
#             return json.loads(text).get("ping") == "pong"
#         except Exception:
#             return False

