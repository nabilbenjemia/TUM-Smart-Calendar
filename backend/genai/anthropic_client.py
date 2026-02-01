import json
import os
from typing import Any, Dict
import openai
from google import genai
from config import  GENAI_API_KEY, GENAI_MODEL  # your config values
from pydantic import BaseModel, Field
from typing import List, Dict, Any



# Examples used for study-schedule prompt (kept small and predictable)
EXAMPLE_1 = '{"userId":"1","exams":[{"id":"1234","courseName":"Math","ects":6,"examDateTime":"2025-03-10T09:00:00","durationMinutes":120}]}'

EXAMPLE_2 = '{"userId":"2","exams":[{"id":"201","courseName":"Algorithms","ects":7,"examDateTime":"2025-04-05T10:00:00","durationMinutes":180},{"id":"202","courseName":"Databases","ects":6,"examDateTime":"2025-04-12T09:00:00","durationMinutes":120}]}'

EXAMPLE_3 = '{"userId":"3","exams":[{"id":"301","courseName":"Operating Systems","ects":8,"examDateTime":"2025-05-18T13:00:00","durationMinutes":150}]}'

EXAMPLE_4 = '{"userId":"4","exams":[{"id":"401","courseName":"Linear Algebra","ects":5,"examDateTime":"2025-06-02T09:00:00","durationMinutes":120}]}'



class TimeSlotClass(BaseModel):
    examId: str = Field(description="ID of the exam")
    title: str = Field(description="Title of the study session")
    startTime: str = Field(description="ISO 8601 start time")
    endTime: str = Field(description="ISO 8601 end time")
    color: str = Field(description="A hex color code (e.g., #FF5733) to represent the study plan for this specific exam. Use the same color for all sessions of the same exam.")

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
            "User Schedule Data:\n" + input_as_string + 
            "\n\nPlease generate a new study plan based on the rules below."
        )

        # Update examples with color
        EX1_OUT = '{"userId":"1","TimeSlot":[{"examId":"1234","title":"Study Math","startTime":"2025-02-01T10:00:00","endTime":"2025-02-01T12:00:00","color":"#A1C9F4"},{"examId":"1234","title":"Study Math","startTime":"2025-02-03T10:00:00","endTime":"2025-02-03T12:00:00","color":"#A1C9F4"},{"examId":"1234","title":"Study Math","startTime":"2025-02-05T11:00:00","endTime":"2025-02-05T13:00:00","color":"#A1C9F4"}]}'

        EX2_OUT = '{"userId":"2","TimeSlot":[{"examId":"201","title":"Study Algorithms","startTime":"2025-03-01T09:00:00","endTime":"2025-03-01T11:00:00","color":"#FFB482"},{"examId":"201","title":"Study Algorithms","startTime":"2025-03-03T09:00:00","endTime":"2025-03-03T11:00:00","color":"#FFB482"},{"examId":"202","title":"Study Databases","startTime":"2025-03-02T14:00:00","endTime":"2025-03-02T16:00:00","color":"#8DE5A1"},{"examId":"202","title":"Study Databases","startTime":"2025-03-04T14:00:00","endTime":"2025-03-04T16:00:00","color":"#8DE5A1"}]}'

        EX3_OUT = '{"userId":"3","TimeSlot":[{"examId":"301","title":"Study Operating Systems","startTime":"2025-04-10T10:00:00","endTime":"2025-04-10T13:00:00","color":"#D0BBFF"},{"examId":"301","title":"Study Operating Systems","startTime":"2025-04-12T10:00:00","endTime":"2025-04-12T13:00:00","color":"#D0BBFF"},{"examId":"301","title":"Study Operating Systems","startTime":"2025-04-14T11:00:00","endTime":"2025-04-14T14:00:00","color":"#D0BBFF"}]}'

        EX4_OUT = '{"userId":"4","TimeSlot":[{"examId":"401","title":"Study Linear Algebra","startTime":"2025-05-01T08:00:00","endTime":"2025-05-01T10:00:00","color":"#FAB0E4"},{"examId":"401","title":"Study Linear Algebra","startTime":"2025-05-03T08:00:00","endTime":"2025-05-03T10:00:00","color":"#FAB0E4"},{"examId":"401","title":"Study Linear Algebra","startTime":"2025-05-05T09:00:00","endTime":"2025-05-05T11:00:00","color":"#FAB0E4"}]}'

        SYSTEM_INSTRUCTION = (
            "You are a HIGH-PERFORMANCE Study Planner AI. Your mission is to create a multi-week study schedule while strictly avoiding busy times.\n\n"
            "You will receive the input in the following format:\n"
            "1. currentDateTime: Start time for planning.\n"
            "2. existingEvents: THESE ARE BUSY TIMES. Do not schedule anything here. They are ALREADY on the user's calendar.\n"
            "3. exams: Target exam sessions. You must plan study leading up to these.\n"
            "4. freeSlots: If non-empty, use ONLY these windows.\n\n"
            "When generating the study session, follow these rules:\n"
            "1. Ensure all date-time fields are in ISO 8601 format and that time is always a whole number. Eg. 10:30 is not accepted but 10:00 or 11:00 is.\n"
            "2. Do not include any explanations or additional text outside the JSON structure.\n"
            "3. Assign a unique HEX color to each different exam. Use the same color for all study sessions belonging to the same examId. Only for the exam itself, use a darker shade of the same color.\n"
            "4. Consider the amount of credits (ects) when creating study plans. Allocate more study time for exams with higher ects values.\n"
            "5. Distribute study sessions evenly over the weeks leading up to the exam date. If there is more than 1 week between the current date and the exam date, do not schedule all the study sessions in one week.\n"
            "6. If there are multiple exams, ensure that study sessions for different subjects do not overlap.\n"
            "7. if there are existing calendar events (existingEvents), AVOID scheduling study sessions during those times.\n"
            "8. Most Important Rule: Study plans can only be created between the current date (currentDateTime) and the exam date. Do not create study sessions before the current date or after the exam date.\n"
            "9. if the current date is after the exam date, then do not create any study sessions.\n"
            "10. Don't keep the study sessions continuous. Keep some gap between the study sessions."
            "11. Courses with higher ects should be given more study time."
            "12. Courses with lower ects should be given less study time."
            "13. If the 'freeSlots' list is empty or not provided, you have complete freedom to schedule study sessions anytime between 9 AM and 10 PM each day, between the current date and the exam date."
            "14. If the 'freeSlots' list is not empty, you have to schedule study sessions ONLY during those times."
            "Return a JSON-only response. "
            "You are to respond in the same format as the examples below.\n\n"
            "Example Input:\n" + EXAMPLE_1 + "\nExample Output:\n" + EX1_OUT + "\n\n"
            "Example Input:\n" + EXAMPLE_2 + "\nExample Output:\n" + EX2_OUT + "\n\n"
            "Example Input:\n" + EXAMPLE_3 + "\nExample Output:\n" + EX3_OUT + "\n\n"
            "Example Input:\n" + EXAMPLE_4 + "\nExample Output:\n" + EX4_OUT + "\n\n"
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

        return schema.model_validate_json(response.text).model_dump()
    
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


