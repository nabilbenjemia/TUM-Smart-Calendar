package com.tum.smartcalendar.calendar.dto;

import com.tum.smartcalendar.calendar.model.Exam;
import java.util.List;

public class ExamRequestDTO {

    private String userId;
    private List<Exam> exams;

    public ExamRequestDTO() {}

    public ExamRequestDTO(String userId, List<Exam> exams) {
        this.userId = userId;
        this.exams = exams;
    }

    public String getUserId() {
        return userId;
    }

    public List<Exam> getExams() {
        return exams;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setExams(List<Exam> exams) {
        this.exams = exams;
    }
}
