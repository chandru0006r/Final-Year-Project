package com.inter.demo.trusted.service;

import com.inter.demo.trusted.model.MentorRemark;
import com.inter.demo.trusted.model.Student;
import com.inter.demo.trusted.repo.MentorRemarkRepository;
import com.inter.demo.trusted.repo.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    private final StudentRepository students;
    private final MentorRemarkRepository remarks;

    public StudentService(StudentRepository students, MentorRemarkRepository remarks) { this.students = students; this.remarks = remarks; }

    public List<Student> list(String mentorId) {
        if (mentorId == null || mentorId.isBlank()) return students.findAll();
        return students.findByMentorId(mentorId);
    }

    public Optional<Student> get(String id) { return students.findById(id); }

    public Student save(Student s) { return students.save(s); }

    public void addRemark(String studentId, String text) {
        students.findById(studentId).orElseThrow();
        MentorRemark r = new MentorRemark(studentId, text);
        remarks.save(r);
    }
}
