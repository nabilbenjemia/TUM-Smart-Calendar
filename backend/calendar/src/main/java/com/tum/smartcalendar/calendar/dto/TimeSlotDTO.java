package com.tum.smartcalendar.calendar.dto;

public class TimeSlotDTO {

    private String examId;
    private String title;
    private String startTime;
    private String endTime;

    public TimeSlotDTO() {}

    public String getExamId() {
        return examId;
    }

    public String getTitle() {
        return title;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setExamId(String examId) {
        this.examId = examId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
