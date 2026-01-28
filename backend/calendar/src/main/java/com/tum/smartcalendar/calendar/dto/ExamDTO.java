package com.tum.smartcalendar.calendar.dto;

public class ExamDTO {
    private String id;
    private String courseName;
    private int ects;
    private String examDateTime;
    private int durationMinutes;

    public ExamDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public int getEcts() { return ects; }
    public void setEcts(int ects) { this.ects = ects; }
    public String getExamDateTime() { return examDateTime; }
    public void setExamDateTime(String examDateTime) { this.examDateTime = examDateTime; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
}
