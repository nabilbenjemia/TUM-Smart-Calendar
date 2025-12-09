package com.tum.smartcalendar.calendar.dto;

import com.tum.smartcalendar.calendar.model.Exam;
import java.util.List;

public class ScheduleRequestDTO {

    private String userId;
    private List<Exam> exams;
    private List<FreeSlotDTO> freeSlots;

    public ScheduleRequestDTO() {} // REQUIRED

    public ScheduleRequestDTO(String userId, List<Exam> exams, List<FreeSlotDTO> freeSlots) {
        this.userId = userId;
        this.exams = exams;
        this.freeSlots = freeSlots;
    }

    public String getUserId() { return userId; }
    public List<Exam> getExams() { return exams; }
    public List<FreeSlotDTO> getFreeSlots() { return freeSlots; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setExams(List<Exam> exams) { this.exams = exams; }
    public void setFreeSlots(List<FreeSlotDTO> freeSlots) { this.freeSlots = freeSlots; }
}
