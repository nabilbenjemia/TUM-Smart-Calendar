package com.tum.smartcalendar.calendar.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "timeslots")
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;

    private String examId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private CalendarEntryType type;

    @Enumerated(EnumType.STRING)
    private SlotSource source;

    private String title;
    private String color;

    public TimeSlot() {
    }

    public TimeSlot(String userId, String examId,
            LocalDateTime start, LocalDateTime end,
            CalendarEntryType type, SlotSource source,
            String title, String color) {
        this.userId = userId;
        this.examId = examId;
        this.startTime = start;
        this.endTime = end;
        this.type = type;
        this.source = source;
        this.title = title;
        this.color = color;
    }

    public boolean overlapsWith(TimeSlot other) {
        return startTime.isBefore(other.endTime)
                && other.startTime.isBefore(endTime);
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getExamId() {
        return examId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public CalendarEntryType getType() {
        return type;
    }

    public SlotSource getSource() {
        return source;
    }

    public String getTitle() {
        return title;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setExamId(String examId) {
        this.examId = examId;
    }

    public void setType(CalendarEntryType type) {
        this.type = type;
    }

    public void setSource(SlotSource source) {
        this.source = source;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "TimeSlot{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", examId='" + examId + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", type=" + type +
                ", source=" + source +
                ", title='" + title + '\'' +
                '}';
    }
}
