package com.inter.demo.services;

import com.inter.demo.entities.Student;
import com.inter.demo.repositories.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class TrustScoreService {
    private final StudentRepository studentRepository;

    public TrustScoreService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public void recalculateForStudent(String studentId) {
        // Placeholder for complex recalculation logic; for now keep stored value
        Student s = studentRepository.findById(studentId).orElse(null);
        if (s == null) return;
        int base = s.getTrustScore() == null ? 70 : s.getTrustScore();
        // Optionally use breakdowns if present
        s.setTrustScore(base);
        studentRepository.save(s);
    }
}
