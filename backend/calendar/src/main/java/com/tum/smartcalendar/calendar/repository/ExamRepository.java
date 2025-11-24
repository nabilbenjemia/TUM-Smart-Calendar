package com.tum.smartcalendar.calendar.repository;

import com.tum.smartcalendar.calendar.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, String> {
    List<Exam> findByUserId(String userId);
}
