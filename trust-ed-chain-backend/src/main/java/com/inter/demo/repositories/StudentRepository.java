package com.inter.demo.repositories;

import com.inter.demo.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByMentorId(String mentorId);
}
