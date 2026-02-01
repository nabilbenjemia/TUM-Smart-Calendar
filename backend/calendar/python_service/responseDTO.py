from pydantic import BaseModel
from typing import List

class TimeSlotDTO(BaseModel):
    examId: str
    title: str
    startTime: str
    endTime: str


class ScheduleResponseDTO(BaseModel):
    userId: str
    timeSlots: List[TimeSlotDTO]