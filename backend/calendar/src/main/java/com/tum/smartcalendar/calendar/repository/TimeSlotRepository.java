package com.tum.smartcalendar.calendar.repository;

import com.tum.smartcalendar.calendar.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, String> {

    List<TimeSlot> findByUserId(String userId);
    List<TimeSlot> findByUserIdAndExamId(String userId, String examId);
}
