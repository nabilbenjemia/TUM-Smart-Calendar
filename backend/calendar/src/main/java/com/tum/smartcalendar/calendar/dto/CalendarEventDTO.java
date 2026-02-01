package com.tum.smartcalendar.calendar.dto;

import com.tum.smartcalendar.calendar.model.CalendarEntryType;

public class CalendarEventDTO {

    private String id;
    private String title;
    private String startTime;
    private String endTime;
    private CalendarEntryType type;
    private String color;

    public CalendarEventDTO() {
    } // REQUIRED for JSON

    public CalendarEventDTO(String id, String title, String startTime, String endTime, CalendarEntryType type,
            String color) {
        this.id = id;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.type = type;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public CalendarEntryType getType() {
        return type;
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

    public void setType(CalendarEntryType type) {
        this.type = type;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
