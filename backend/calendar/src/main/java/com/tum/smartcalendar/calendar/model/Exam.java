package com.tum.smartcalendar.calendar.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;  // multi-user support

    private String courseName;
    private int ects;
    private LocalDateTime examDateTime;
    private int durationMinutes;

    public Exam() {}

    public Exam(String userId, String courseName, int ects,
                LocalDateTime examDateTime, int durationMinutes) {
        this.userId = userId;
        this.courseName = courseName;
        this.ects = ects;
        this.examDateTime = examDateTime;
        this.durationMinutes = durationMinutes;
    }

    public String getId() {
        return id;
    }

    public String getCourseName() {
        return courseName;
    }

    public int getEcts() {
        return ects;
    }

    public LocalDateTime getExamDateTime() {
        return examDateTime;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public void setEcts(int ects) {
        this.ects = ects;
    }

    public void setExamDateTime(LocalDateTime examDateTime) {
        this.examDateTime = examDateTime;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    @Override
    public String toString() {
        return "Exam{" +
                "id='" + id + '\'' +
                ", courseName='" + courseName + '\'' +
                ", ects=" + ects +
                ", examDateTime=" + examDateTime +
                ", durationMinutes=" + durationMinutes +
                '}';
    }
}
