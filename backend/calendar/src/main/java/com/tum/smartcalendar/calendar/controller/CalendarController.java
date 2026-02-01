package com.tum.smartcalendar.calendar.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import com.tum.smartcalendar.calendar.model.Exam;
import com.tum.smartcalendar.calendar.model.TimeSlot;
import com.tum.smartcalendar.calendar.service.CalendarService;
import com.tum.smartcalendar.calendar.dto.CalendarEventDTO;
import com.tum.smartcalendar.calendar.dto.ScheduleFrontendRequestDTO;
import com.tum.smartcalendar.calendar.model.CalendarEntryType;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;
import com.tum.smartcalendar.calendar.model.SlotSource;
import com.tum.smartcalendar.calendar.dto.CalendarEventDTO;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;
    private final com.tum.smartcalendar.calendar.service.ClaudeService claudeService;

    public CalendarController(CalendarService calendarService,
            com.tum.smartcalendar.calendar.service.ClaudeService claudeService) {
        this.calendarService = calendarService;
        this.claudeService = claudeService;
    }

    // -------------------- EXAMS --------------------

    @PostMapping("/{userId}/exams")
    public Exam createExam(
            @PathVariable String userId,
            @RequestBody Exam exam) {
        return calendarService.addExam(userId, exam);
    }

    @GetMapping("/{userId}/exams")
    public List<Exam> getExams(@PathVariable String userId) {
        return calendarService.getUserExams(userId);
    }

    @DeleteMapping("/{userId}/exams/{examId}")
    public void deleteExam(
            @PathVariable String userId,
            @PathVariable String examId) {
        calendarService.deleteExam(userId, examId);
    }

    // -------------------- TIMESLOTS --------------------

    @PostMapping("/{userId}/timeslots")
    public TimeSlot addTimeSlot(
            @PathVariable String userId,
            @RequestBody TimeSlot slot) {
        return calendarService.addTimeSlot(userId, slot);
    }

    @GetMapping("/{userId}/events")
    public List<CalendarEventDTO> getAllEvents(@PathVariable String userId) {
        scheduleLogger.info("Fetching all events for userId: {}", userId);

        // 1) Fetch exams
        var examEvents = calendarService.getUserExams(userId).stream()
                .map(exam -> {
                    LocalDateTime start = exam.getExamDateTime();
                    LocalDateTime end = start.plusMinutes(exam.getDurationMinutes());

                    return new CalendarEventDTO(
                            exam.getId(),
                            "Exam: " + exam.getCourseName(),
                            start.toString(),
                            end.toString(),
                            CalendarEntryType.EXAM,
                            exam.getColor());
                })
                .collect(Collectors.toList());

        // 2) Fetch timeslots
        var timeSlotEvents = calendarService.getUserTimeSlots(userId).stream()
                .map(slot -> new CalendarEventDTO(
                        slot.getId(),
                        slot.getTitle(),
                        slot.getStartTime().toString(),
                        slot.getEndTime().toString(),
                        CalendarEntryType.STUDY,
                        slot.getColor()))
                .collect(Collectors.toList());

        // 3) Merge them into one list
        examEvents.addAll(timeSlotEvents);

        return examEvents;
    }

    @DeleteMapping("/{userId}/timeslots/{slotId}")
    public void deleteTimeSlot(
            @PathVariable String userId,
            @PathVariable String slotId) {
        calendarService.deleteTimeSlot(userId, slotId);
    }

    private static final Logger scheduleLogger = LoggerFactory.getLogger(CalendarController.class);

    @PostMapping("/{userId}/schedule")
    public String generateSchedule(
            @PathVariable String userId,
            @RequestBody ScheduleFrontendRequestDTO frontendRequest) {
        scheduleLogger.info("=== SCHEDULE REQUEST RECEIVED ===");
        scheduleLogger.info("UserId: {}", userId);
        scheduleLogger.info("Request: exams={}, freeSlots={}",
                frontendRequest.getExams() != null ? frontendRequest.getExams().size() : 0,
                frontendRequest.getFreeSlots() != null ? frontendRequest.getFreeSlots().size() : 0);

        // STEP 1: Get exams from frontend request
        var frontendExams = frontendRequest.getExams();
        if (frontendExams == null || frontendExams.isEmpty()) {
            scheduleLogger.warn("No exams provided in request");
            return "No exams provided";
        }

        // STEP 1.5: Save incoming exams to DB and create ID mapping
        java.util.Map<String, String> frontendToDbIdMap = new java.util.HashMap<>();
        for (var examDTO : frontendExams) {
            Exam exam = new Exam(
                    userId,
                    examDTO.getCourseName(),
                    examDTO.getEcts(),
                    LocalDateTime.parse(examDTO.getExamDateTime()),
                    examDTO.getDurationMinutes(),
                    null // color set later
            );
            Exam savedExam = calendarService.addExam(userId, exam);
            frontendToDbIdMap.put(examDTO.getId(), savedExam.getId());
            scheduleLogger.info("Saved incoming exam: {} with DB ID: {}", exam.getCourseName(), savedExam.getId());
        }

        // STEP 2: extract free slots from frontend JSON
        var freeSlots = frontendRequest.getFreeSlots();

        // STEP 2.5: Fetch existing events from DB to avoid overlaps
        LocalDateTime now = LocalDateTime.now();
        // Calculate latest exam date to bound the search, but also consider all future
        // events
        LocalDateTime latestExamDate = frontendExams.stream()
                .map(e -> LocalDateTime.parse(e.getExamDateTime()))
                .max(LocalDateTime::compareTo)
                .orElse(now.plusWeeks(4));

        scheduleLogger.info("Searching for existing events between {} and {}", now, latestExamDate);

        var existingExams = calendarService.getUserExams(userId).stream()
                .filter(exam -> {
                    LocalDateTime examStart = exam.getExamDateTime();
                    LocalDateTime examEnd = examStart.plusMinutes(exam.getDurationMinutes());
                    // Any exam that ends after 'now' and starts before 'latestExamDate'
                    return examEnd.isAfter(now) && examStart.isBefore(latestExamDate);
                })
                .map(exam -> {
                    java.util.Map<String, Object> m = new java.util.HashMap<>();
                    m.put("title", "Exam: " + exam.getCourseName());
                    m.put("startTime", exam.getExamDateTime().toString());
                    m.put("endTime", exam.getExamDateTime().plusMinutes(exam.getDurationMinutes()).toString());
                    return m;
                }).collect(Collectors.toList());

        // Get all user timeslots and filter in-memory for precision regarding overlaps
        var existingTimeSlots = calendarService.getUserTimeSlots(userId).stream()
                .filter(slot -> {
                    // Overlaps if slot ends after 'now' and starts before 'latestExamDate'
                    return slot.getEndTime().isAfter(now) && slot.getStartTime().isBefore(latestExamDate);
                })
                .map(slot -> {
                    java.util.Map<String, Object> m = new java.util.HashMap<>();
                    m.put("title", slot.getTitle());
                    m.put("startTime", slot.getStartTime().toString());
                    m.put("endTime", slot.getEndTime().toString());
                    return m;
                }).collect(Collectors.toList());

        List<java.util.Map<String, Object>> occupiedSlots = new ArrayList<>();
        occupiedSlots.addAll(existingExams);
        occupiedSlots.addAll(existingTimeSlots);

        scheduleLogger.info("Found {} existing events to avoid", occupiedSlots.size());
        if (occupiedSlots.size() > 0) {
            scheduleLogger.info("First existing event: {}", occupiedSlots.get(0));
        }

        // STEP 3: Build request to AI (as a Map for ClaudeService)
        java.util.Map<String, Object> aiRequest = new java.util.HashMap<>();
        aiRequest.put("userId", userId);
        aiRequest.put("currentDateTime", LocalDateTime.now().toString());
        aiRequest.put("existingEvents", occupiedSlots);
        aiRequest.put("exams", frontendExams.stream().map(exam -> {
            java.util.Map<String, Object> examMap = new java.util.HashMap<>();
            examMap.put("id", exam.getId() != null ? exam.getId() : java.util.UUID.randomUUID().toString());
            examMap.put("courseName", exam.getCourseName());
            examMap.put("ects", exam.getEcts());
            examMap.put("examDateTime", exam.getExamDateTime());
            examMap.put("durationMinutes", exam.getDurationMinutes());
            return examMap;
        }).collect(Collectors.toList()));
        aiRequest.put("freeSlots", freeSlots);

        // STEP 4: Call AI via ClaudeService (which forwards to GenAI Python service)
        scheduleLogger.info("Sending to GenAI: {}", aiRequest);
        java.util.Map<String, Object> response = claudeService.processJson(aiRequest);
        scheduleLogger.info("GenAI Response: {}", response);

        if (response == null || response.containsKey("error")) {
            return "AI returned error: " + response.get("error");
        }

        // STEP 5: Parse and save generated timeslots
        @SuppressWarnings("unchecked")
        java.util.List<java.util.Map<String, Object>> timeSlots = (java.util.List<java.util.Map<String, Object>>) response
                .get("TimeSlot");

        if (timeSlots == null || timeSlots.isEmpty()) {
            return "AI returned no timeslots";
        }

        for (var slotMap : timeSlots) {
            String examId = (String) slotMap.get("examId");
            String color = (String) slotMap.get("color");
            LocalDateTime startTime = LocalDateTime.parse((String) slotMap.get("startTime"));
            LocalDateTime endTime = LocalDateTime.parse((String) slotMap.get("endTime"));

            // Mapping frontend internal ID to database ID
            String dbExamId = frontendToDbIdMap.getOrDefault(examId, examId);

            // Find the associated exam (using DB ID or frontend ID as fallback)
            var associatedExam = calendarService.getUserExams(userId).stream()
                    .filter(e -> dbExamId.equals(e.getId()))
                    .findFirst();

            if (associatedExam.isEmpty()) {
                scheduleLogger.warn("Study slot references unknown exam: {}", dbExamId);
                continue;
            }

            LocalDateTime examDate = associatedExam.get().getExamDateTime();

            // FILTER: Must be after 'now' and before 'examDate'
            if (startTime.isBefore(now)) {
                scheduleLogger.warn("Discarding study slot: starts in the past ({})", startTime);
                continue;
            }
            if (endTime.isAfter(examDate)) {
                scheduleLogger.warn("Discarding study slot: ends after exam ({})", endTime);
                continue;
            }

            TimeSlot slot = new TimeSlot(
                    userId,
                    dbExamId,
                    startTime,
                    endTime,
                    CalendarEntryType.STUDY,
                    SlotSource.AUTO_GENERATED,
                    (String) slotMap.get("title"),
                    color);
            calendarService.addTimeSlot(userId, slot);

            // Update Exam color if not set
            if (color != null && dbExamId != null) {
                associatedExam.ifPresent(e -> {
                    if (e.getColor() == null) {
                        e.setColor(color);
                        calendarService.addExam(userId, e);
                    }
                });
            }
        }

        return "Schedule generated and saved";
    }

    @GetMapping("/{userId}/timeslots/range")
    public List<TimeSlot> getTimeSlotsInRange(
            @PathVariable String userId,
            @RequestParam String from,
            @RequestParam String to) {
        LocalDateTime fromDate = LocalDateTime.parse(from);
        LocalDateTime toDate = LocalDateTime.parse(to);

        return calendarService.getUserTimeSlotsInRange(userId, fromDate, toDate);
    }

    @GetMapping("/{userId}/events/range")
    public List<CalendarEventDTO> getEventsInRange(
            @PathVariable String userId,
            @RequestParam String from,
            @RequestParam String to) {
        LocalDateTime fromDate = LocalDateTime.parse(from);
        LocalDateTime toDate = LocalDateTime.parse(to);
        List<CalendarEventDTO> result = new ArrayList<>();

        // 1) Exams in range
        var examEvents = calendarService.getUserExams(userId).stream()
                .filter(exam -> {
                    LocalDateTime start = exam.getExamDateTime();
                    LocalDateTime end = start.plusMinutes(exam.getDurationMinutes());
                    return !start.isAfter(toDate) && !end.isBefore(fromDate);
                })
                .map(exam -> {
                    LocalDateTime start = exam.getExamDateTime();
                    LocalDateTime end = start.plusMinutes(exam.getDurationMinutes());

                    return new CalendarEventDTO(
                            exam.getId(),
                            "Exam: " + exam.getCourseName(),
                            start.toString(),
                            end.toString(),
                            CalendarEntryType.EXAM,
                            exam.getColor());
                })
                .collect(Collectors.toList());

        // 2) Timeslots in range
        var slotEvents = calendarService.getUserTimeSlotsInRange(userId, fromDate, toDate).stream()
                .map(slot -> new CalendarEventDTO(
                        slot.getId(),
                        slot.getTitle(),
                        slot.getStartTime().toString(),
                        slot.getEndTime().toString(),
                        CalendarEntryType.STUDY,
                        slot.getColor()))
                .collect(Collectors.toList());

        // 3) Merge
        result.addAll(examEvents);
        result.addAll(slotEvents);

        return result;
    }

}
