from pydantic import BaseModel
from typing import List

class ExamDTO(BaseModel):
    id: str
    courseName: str
    durationMinutes: int


class FreeSlotDTO(BaseModel):
    startTime: str
    endTime: str


class ScheduleRequestDTO(BaseModel):
    userId: str
    exams: List[ExamDTO]
    freeSlots: List[FreeSlotDTO]