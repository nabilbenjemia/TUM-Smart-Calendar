package com.tum.smartcalendar.calendar.controller;

import com.tum.smartcalendar.calendar.model.Exam;
import com.tum.smartcalendar.calendar.model.TimeSlot;
import com.tum.smartcalendar.calendar.service.CalendarService;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;
import com.tum.smartcalendar.calendar.dto.ExamRequestDTO;
import com.tum.smartcalendar.calendar.dto.TimeSlotDTO;
import com.tum.smartcalendar.calendar.dto.TimeSlotResponseDTO;
import com.tum.smartcalendar.calendar.model.CalendarEntryType;
import com.tum.smartcalendar.calendar.model.SlotSource;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;
    private final RestTemplate restTemplate = new RestTemplate();

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

    @PostMapping("/{userId}/schedule")
    public String generateSchedule(@PathVariable String userId) {

        // STEP 2: get exams from DB
        var exams = calendarService.getUserExams(userId);

        // build request for AI
        ExamRequestDTO requestBody = new ExamRequestDTO(userId, exams);

        // STEP 3: call the AI service
        String aiUrl = "AI"; //  change this !!!!!!!!!!!!

        TimeSlotResponseDTO response = restTemplate.postForObject(
                aiUrl,
                requestBody,
                TimeSlotResponseDTO.class
        );

        if (response == null || response.getTimeSlots() == null) {
            return "AI did not return any timeslots";
        }

        // STEP 4: convert AI timeslots to TimeSlot entities and save
        for (TimeSlotDTO dto : response.getTimeSlots()) {
            TimeSlot slot = new TimeSlot(
                    userId,
                    dto.getExamId(),
                    LocalDateTime.parse(dto.getStartTime()),
                    LocalDateTime.parse(dto.getEndTime()),
                    CalendarEntryType.STUDY,
                    SlotSource.AUTO_GENERATED,
                    dto.getTitle()
            );
            calendarService.addTimeSlot(userId, slot);
        }

        return "Schedule generated and timeslots saved";
    }
}
