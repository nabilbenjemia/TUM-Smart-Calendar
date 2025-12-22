package com.tum.smartcalendar.calendar.service;

import com.tum.smartcalendar.calendar.model.Exam;
import com.tum.smartcalendar.calendar.model.TimeSlot;
import com.tum.smartcalendar.calendar.repository.ExamRepository;
import com.tum.smartcalendar.calendar.repository.TimeSlotRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CalendarServiceImpl implements CalendarService {

    private final ExamRepository examRepo;
    private final TimeSlotRepository slotRepo;

    public CalendarServiceImpl(ExamRepository examRepo, TimeSlotRepository slotRepo) {
        this.examRepo = examRepo;
        this.slotRepo = slotRepo;
    }

    @Override
    public Exam addExam(String userId, Exam exam) {
        exam.setUserId(userId);
        return examRepo.save(exam);
    }

    @Override
    public List<Exam> getUserExams(String userId) {
        return examRepo.findByUserId(userId);
    }

    @Override
    public void deleteExam(String userId, String examId) {
        examRepo.deleteById(examId);
        slotRepo.findByUserIdAndExamId(userId, examId)
                .forEach(slot -> slotRepo.deleteById(slot.getId()));
    }

    @Override
    public TimeSlot addTimeSlot(String userId, TimeSlot slot) {
        slot.setUserId(userId);
        return slotRepo.save(slot);
    }

    @Override
    public List<TimeSlot> getUserTimeSlots(String userId) {
        return slotRepo.findByUserId(userId);
    }

    @Override
    public List<TimeSlot> getExamTimeSlots(String userId, String examId) {
        return slotRepo.findByUserIdAndExamId(userId, examId);
    }

    @Override
    public void deleteTimeSlot(String userId, String slotId) {
        slotRepo.deleteById(slotId);
    }
    @Override
    public List<TimeSlot> getUserTimeSlotsInRange(String userId, LocalDateTime from, LocalDateTime to) {
        return slotRepo.findByUserIdAndStartTimeBetween(userId, from, to);
    }

}
