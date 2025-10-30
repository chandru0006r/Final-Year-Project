package com.inter.demo.trusted.web;

import com.inter.demo.trusted.model.Student;
import com.inter.demo.trusted.service.AuditService;
import com.inter.demo.trusted.service.StudentService;
import com.inter.demo.trusted.web.dto.Requests;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StudentController {
    private final StudentService students;
    private final AuditService audit;

    public StudentController(StudentService students, AuditService audit) {
        this.students = students;
        this.audit = audit;
    }

    @GetMapping("/students")
    public List<Student> list(@RequestParam(value = "mentorId", required = false) String mentorId) {
        return students.list(mentorId);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<Student> get(@PathVariable String id) {
        return students.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admin/sef/update")
    public ResponseEntity<Student> updateSef(@RequestBody @Valid Requests.UpdateSef req) {
        Student s = students.get(req.studentId()).orElse(null);
        if (s == null) return ResponseEntity.notFound().build();
        if (req.sefBalance() != null) s.setSefBalance(req.sefBalance());
        if (req.sefWithdrawalLimit() != null) s.setSefWithdrawalLimit(req.sefWithdrawalLimit());
        students.save(s);
        audit.log("system", "admin", "ADMIN_SEF_UPDATE", "Student", s.getId(), "Updated SEF fields");
        return ResponseEntity.ok(s);
    }

    @PostMapping("/admin/assign-mentor")
    public ResponseEntity<Student> assignMentor(@RequestBody @Valid Requests.AssignMentor req) {
        Student s = students.get(req.studentId()).orElse(null);
        if (s == null) return ResponseEntity.notFound().build();
        s.setMentorId(req.mentorId());
        students.save(s);
        audit.log("system", "admin", "ASSIGN_MENTOR", "Student", s.getId(), "Mentor set to " + req.mentorId());
        return ResponseEntity.ok(s);
    }

    @PostMapping("/mentor/verify-kyc")
    public ResponseEntity<Student> verifyKyc(@RequestBody @Valid Requests.VerifyKyc req) {
        Student s = students.get(req.studentId()).orElse(null);
        if (s == null) return ResponseEntity.notFound().build();
        s.setKycVerified(req.verified());
        students.save(s);
        audit.log("system", "mentor", "VERIFY_KYC", "Student", s.getId(), "verified=" + req.verified());
        return ResponseEntity.ok(s);
    }

    @PostMapping("/mentor/remark")
    public ResponseEntity<?> addRemark(@RequestBody @Valid Requests.MentorRemark req) {
        students.addRemark(req.studentId(), req.text());
        audit.log("system", "mentor", "MENTOR_REMARK", "Student", req.studentId(), req.text());
        return ResponseEntity.status(201).body(java.util.Map.of("id", "rem-" + System.currentTimeMillis(), "text", req.text()));
    }

    @PostMapping("/sef/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody @Valid Requests.SefWithdraw req) {
        Student s = students.get(req.studentId()).orElse(null);
        if (s == null) return ResponseEntity.notFound().build();
        if (req.amount() > s.getSefWithdrawalLimit()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Amount exceeds semester limit"));
        }
        if (req.amount() > s.getSefBalance()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Insufficient SEF balance"));
        }
        s.setSefBalance(s.getSefBalance() - req.amount());
        s.setTrustScore(Math.max(0, s.getTrustScore() - 1));
        students.save(s);
        audit.log(req.studentId(), "student", "SEF_WITHDRAW", "Student", s.getId(), "amount=" + req.amount());
        return ResponseEntity.status(201).body(java.util.Map.of("success", true, "balance", s.getSefBalance()));
    }
}
