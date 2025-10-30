package com.inter.demo.controllers;

import com.inter.demo.dto.SefWithdrawRequest;
import com.inter.demo.services.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/sef")
public class SefController {

    private final StudentService studentService;

    public SefController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody SefWithdrawRequest req) {
        var result = studentService.withdrawSEF(req.studentId(), req.amount());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", result.success(), "balance", result.balance()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
}
