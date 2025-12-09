package com.tum.smartcalendar.calendar.controller;
import java.util.ArrayList;
import com.tum.smartcalendar.calendar.model.Exam;
import com.tum.smartcalendar.calendar.model.TimeSlot;
import com.tum.smartcalendar.calendar.service.CalendarService;
import com.tum.smartcalendar.calendar.dto.CalendarEventDTO;
import com.tum.smartcalendar.calendar.dto.FreeSlotDTO;
import com.tum.smartcalendar.calendar.dto.ScheduleFrontendRequestDTO;
import com.tum.smartcalendar.calendar.dto.ScheduleRequestDTO;
import com.tum.smartcalendar.calendar.dto.TimeSlotDTO;
import com.tum.smartcalendar.calendar.dto.TimeSlotResponseDTO;
import com.tum.smartcalendar.calendar.model.CalendarEntryType;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;
import com.tum.smartcalendar.calendar.dto.ExamRequestDTO;
import com.tum.smartcalendar.calendar.dto.TimeSlotDTO;
import com.tum.smartcalendar.calendar.model.CalendarEntryType;
import com.tum.smartcalendar.calendar.model.SlotSource;
import org.springframework.web.client.RestTemplate;
import com.tum.smartcalendar.calendar.dto.CalendarEventDTO;
import java.time.LocalDateTime;
import java.util.stream.Collectors;


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
    
   
    @GetMapping("/{userId}/events")
    public List<CalendarEventDTO> getAllEvents(@PathVariable String userId) {

    // 1) Fetch exams
    var examEvents = calendarService.getUserExams(userId).stream()
            .map(exam -> {
                LocalDateTime start = exam.getExamDateTime();
                LocalDateTime end = start.plusMinutes(exam.getDurationMinutes());

                return new CalendarEventDTO(
                        "Exam: " + exam.getCourseName(),
                        start.toString(),
                        end.toString(),
                        CalendarEntryType.EXAM
                );
            })
            .collect(Collectors.toList());

    // 2) Fetch timeslots
    var timeSlotEvents = calendarService.getUserTimeSlots(userId).stream()
            .map(slot -> new CalendarEventDTO(
                    slot.getTitle(),
                    slot.getStartTime().toString(),
                    slot.getEndTime().toString(),
                    CalendarEntryType.STUDY
            ))
            .collect(Collectors.toList());

    // 3) Merge them into one list
    examEvents.addAll(timeSlotEvents);

    return examEvents;
    }


    @DeleteMapping("/{userId}/timeslots/{slotId}")
    public void deleteTimeSlot(
            @PathVariable String userId,
            @PathVariable String slotId
    ) {
        calendarService.deleteTimeSlot(userId, slotId);
    }
@PostMapping("/{userId}/schedule")
public String generateSchedule(
        @PathVariable String userId,
        @RequestBody ScheduleFrontendRequestDTO frontendRequest
) {
    // STEP 1: fetch exams from DB
    var exams = calendarService.getUserExams(userId);

    // STEP 2: extract free slots from frontend JSON
    var freeSlots = frontendRequest.getFreeSlots();

    // STEP 3: Build request to AI
    ScheduleRequestDTO aiRequest = new ScheduleRequestDTO(
            userId,
            exams,
            freeSlots
    );

    String aiUrl = "http://localhost:5000/schedule-ai"; // your AI URL

    // STEP 4: Call AI
    TimeSlotResponseDTO response = restTemplate.postForObject(
            aiUrl,
            aiRequest,
            TimeSlotResponseDTO.class
    );

    if (response == null || response.getTimeSlots() == null) {
        return "AI returned no timeslots";
    }

    // STEP 5: Save generated timeslots
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

    return "Schedule generated and saved";
}

    @GetMapping("/{userId}/timeslots/range")
    public List<TimeSlot> getTimeSlotsInRange(
            @PathVariable String userId,
            @RequestParam String from,
            @RequestParam String to
    ) {
        LocalDateTime fromDate = LocalDateTime.parse(from);
        LocalDateTime toDate = LocalDateTime.parse(to);

        return calendarService.getUserTimeSlotsInRange(userId, fromDate, toDate);
    }
    @GetMapping("/{userId}/events/range")
    public List<CalendarEventDTO> getEventsInRange(
            @PathVariable String userId,
            @RequestParam String from,
            @RequestParam String to
    ) {
        LocalDateTime fromDate = LocalDateTime.parse(from);
        LocalDateTime toDate = LocalDateTime.parse(to);
    List<CalendarEventDTO> result = new ArrayList<>();

    // ----------------------------
    // 1) Exams in range
    // ----------------------------
    var exams = calendarService.getUserExams(userId);

    var examEvents = exams.stream()
            .filter(exam -> {
                LocalDateTime start = exam.getExamDateTime();
                LocalDateTime end = start.plusMinutes(exam.getDurationMinutes());
                return !start.isAfter(toDate) && !end.isBefore(fromDate); // overlap check
            })
            .map(exam -> {
                LocalDateTime start = exam.getExamDateTime();
                LocalDateTime end = start.plusMinutes(exam.getDurationMinutes());

                return new CalendarEventDTO(
                        "Exam: " + exam.getCourseName(),
                        start.toString(),
                        end.toString(),
                        CalendarEntryType.EXAM
                );
            })
            .toList();

    // ----------------------------
    // 2) Timeslots in range
    // ----------------------------
    var slots = calendarService.getUserTimeSlotsInRange(userId, fromDate, toDate);

    var slotEvents = slots.stream()
            .map(slot -> new CalendarEventDTO(
                    slot.getTitle(),
                    slot.getStartTime().toString(),
                    slot.getEndTime().toString(),
                    CalendarEntryType.STUDY
            ))
            .toList();

    // ----------------------------
    // 3) Merge
    // ----------------------------
    result.addAll(examEvents);
    result.addAll(slotEvents);

    return result;
}
    
 
}
