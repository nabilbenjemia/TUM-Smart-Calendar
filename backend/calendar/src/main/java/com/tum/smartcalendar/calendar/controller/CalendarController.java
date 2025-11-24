package com.tum.smartcalendar.calendar.controller;

import com.tum.smartcalendar.calendar.model.Exam;
import com.tum.smartcalendar.calendar.model.TimeSlot;
import com.tum.smartcalendar.calendar.service.CalendarService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    // -------------------- EXAMS --------------------

    @PostMapping("/{userId}/exams")
    public Exam createExam(
            @PathVariable String userId,
            @RequestBody Exam exam
    ) {
        return calendarService.addExam(userId, exam);
    }

    @GetMapping("/{userId}/exams")
    public List<Exam> getExams(@PathVariable String userId) {
        return calendarService.getUserExams(userId);
    }

    @DeleteMapping("/{userId}/exams/{examId}")
    public void deleteExam(
            @PathVariable String userId,
            @PathVariable String examId
    ) {
        calendarService.deleteExam(userId, examId);
    }

    // -------------------- TIMESLOTS --------------------

    @PostMapping("/{userId}/timeslots")
    public TimeSlot addTimeSlot(
            @PathVariable String userId,
            @RequestBody TimeSlot slot
    ) {
        return calendarService.addTimeSlot(userId, slot);
    }

    @GetMapping("/{userId}/timeslots")
    public List<TimeSlot> getTimeSlots(
            @PathVariable String userId
    ) {
        return calendarService.getUserTimeSlots(userId);
    }

    @DeleteMapping("/{userId}/timeslots/{slotId}")
    public void deleteTimeSlot(
            @PathVariable String userId,
            @PathVariable String slotId
    ) {
        calendarService.deleteTimeSlot(userId, slotId);
    }
}
