package com.tum.smartcalendar.calendar.service;

import com.tum.smartcalendar.calendar.model.Exam;
import com.tum.smartcalendar.calendar.model.TimeSlot;

import java.util.List;

public interface CalendarService {

    Exam addExam(String userId, Exam exam);
    List<Exam> getUserExams(String userId);
    void deleteExam(String userId, String examId);

    TimeSlot addTimeSlot(String userId, TimeSlot timeSlot);
    List<TimeSlot> getUserTimeSlots(String userId);
    List<TimeSlot> getExamTimeSlots(String userId, String examId);
    void deleteTimeSlot(String userId, String slotId);
}
