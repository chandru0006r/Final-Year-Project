package com.inter.demo.trusted.repo;

import com.inter.demo.trusted.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByMentorId(String mentorId);
}
