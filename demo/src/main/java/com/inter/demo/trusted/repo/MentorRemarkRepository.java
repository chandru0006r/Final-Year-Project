package com.inter.demo.trusted.repo;

import com.inter.demo.trusted.model.MentorRemark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MentorRemarkRepository extends JpaRepository<MentorRemark, Long> {
    List<MentorRemark> findByStudentId(String studentId);
}
