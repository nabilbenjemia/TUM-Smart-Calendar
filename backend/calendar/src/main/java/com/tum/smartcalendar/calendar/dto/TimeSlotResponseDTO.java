package com.tum.smartcalendar.calendar.dto;

import java.util.List;

public class TimeSlotResponseDTO {

    private String userId;
    private List<TimeSlotDTO> timeSlots;

    public TimeSlotResponseDTO() {}

    public String getUserId() {
        return userId;
    }

    public List<TimeSlotDTO> getTimeSlots() {
        return timeSlots;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setTimeSlots(List<TimeSlotDTO> timeSlots) {
        this.timeSlots = timeSlots;
    }
}
