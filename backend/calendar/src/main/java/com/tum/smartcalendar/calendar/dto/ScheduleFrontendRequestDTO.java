package com.tum.smartcalendar.calendar.dto;

import java.util.List;

public class ScheduleFrontendRequestDTO {

    private List<ExamDTO> exams;
    private List<FreeSlotDTO> freeSlots;

    public ScheduleFrontendRequestDTO() {} // REQUIRED

    public ScheduleFrontendRequestDTO(List<ExamDTO> exams, List<FreeSlotDTO> freeSlots) {
        this.exams = exams;
        this.freeSlots = freeSlots;
    }

    public List<ExamDTO> getExams() {
        return exams;
    }

    public void setExams(List<ExamDTO> exams) {
        this.exams = exams;
    }

    public List<FreeSlotDTO> getFreeSlots() {
        return freeSlots;
    }

    public void setFreeSlots(List<FreeSlotDTO> freeSlots) {
        this.freeSlots = freeSlots;
    }
}
