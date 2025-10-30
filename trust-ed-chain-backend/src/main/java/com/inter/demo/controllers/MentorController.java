package com.inter.demo.controllers;

import com.inter.demo.dto.MentorRemarkRequest;
import com.inter.demo.dto.MentorVerifyKycRequest;
import com.inter.demo.entities.Student;
import com.inter.demo.services.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mentor")
public class MentorController {

    private final StudentService studentService;

    public MentorController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/verify-kyc")
    public Student verifyKyc(@RequestBody MentorVerifyKycRequest req) {
        return studentService.verifyKYC(req.studentId(), req.verified());
    }

    @PostMapping("/remark")
    public ResponseEntity<Student.Remark> addRemark(@RequestBody MentorRemarkRequest req) {
        Student.Remark remark = studentService.addRemark(req.studentId(), req.text());
        return ResponseEntity.status(HttpStatus.CREATED).body(remark);
    }
}
