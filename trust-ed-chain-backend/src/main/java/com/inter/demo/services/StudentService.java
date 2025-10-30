package com.inter.demo.services;

import com.inter.demo.entities.Student;
import com.inter.demo.repositories.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final AuditService auditService;
    private final TrustScoreService trustScoreService;

    public StudentService(StudentRepository studentRepository,
                          AuditService auditService,
                          TrustScoreService trustScoreService) {
        this.studentRepository = studentRepository;
        this.auditService = auditService;
        this.trustScoreService = trustScoreService;
    }

    public List<Student> getStudents(String mentorId) {
        return mentorId == null || mentorId.isBlank() ? studentRepository.findAll() : studentRepository.findByMentorId(mentorId);
    }

    public Optional<Student> getStudent(String id) {
        return studentRepository.findById(id);
    }

    @Transactional
    public Student updateSEF(String studentId, Long sefBalance, Long sefWithdrawalLimit) {
        Student s = studentRepository.findById(studentId).orElseThrow();
        if (sefBalance != null) s.setSefBalance(sefBalance);
        if (sefWithdrawalLimit != null) s.setSefWithdrawalLimit(sefWithdrawalLimit);
        s.setUpdatedAt(Instant.now());
        Student saved = studentRepository.save(s);
        auditService.log("ADMIN_UPDATE_SEF", "studentId=" + studentId + ", balance=" + s.getSefBalance());
        return saved;
    }

    @Transactional
    public Student assignMentor(String studentId, String mentorId) {
        Student s = studentRepository.findById(studentId).orElseThrow();
        s.setMentorId(mentorId);
        s.setUpdatedAt(Instant.now());
        Student saved = studentRepository.save(s);
        auditService.log("ADMIN_ASSIGN_MENTOR", "studentId=" + studentId + ", mentorId=" + mentorId);
        return saved;
    }

    @Transactional
    public Student verifyKYC(String studentId, boolean verified) {
        Student s = studentRepository.findById(studentId).orElseThrow();
        s.setKycVerified(verified);
        s.setUpdatedAt(Instant.now());
        Student saved = studentRepository.save(s);
        auditService.log("MENTOR_VERIFY_KYC", "studentId=" + studentId + ", verified=" + verified);
        return saved;
    }

    @Transactional
    public Student.Remark addRemark(String studentId, String text) {
        Student s = studentRepository.findById(studentId).orElseThrow();
        Student.Remark r = new Student.Remark();
        r.setId("rem-" + UUID.randomUUID());
        r.setText(text);
        r.setAt(Instant.now());
        s.getMentorRemarks().add(r);
        s.setUpdatedAt(Instant.now());
        studentRepository.save(s);
        auditService.log("MENTOR_ADD_REMARK", "studentId=" + studentId);
        return r;
    }

    @Transactional
    public SefWithdrawResult withdrawSEF(String studentId, long amount) {
        Student s = studentRepository.findById(studentId).orElseThrow();
        if (amount > (s.getSefWithdrawalLimit() == null ? 0 : s.getSefWithdrawalLimit())) {
            throw new IllegalArgumentException("Amount exceeds semester limit");
        }
        if (amount > (s.getSefBalance() == null ? 0 : s.getSefBalance())) {
            throw new IllegalArgumentException("Insufficient SEF balance");
        }
        s.setSefBalance(s.getSefBalance() - amount);
        // simple trust score impact
        s.setTrustScore(Math.max(0, (s.getTrustScore() == null ? 0 : s.getTrustScore()) - 1));
        s.setUpdatedAt(Instant.now());
        studentRepository.save(s);
        auditService.log("SEF_WITHDRAW", "studentId=" + studentId + ", amount=" + amount);
        trustScoreService.recalculateForStudent(studentId);
        return new SefWithdrawResult(true, s.getSefBalance());
    }

    public record SefWithdrawResult(boolean success, long balance) { }
}
