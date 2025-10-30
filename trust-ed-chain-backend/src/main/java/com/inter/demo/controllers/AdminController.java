package com.inter.demo.controllers;

import com.inter.demo.dto.AdminAssignMentorRequest;
import com.inter.demo.dto.AdminUpdateSefRequest;
import com.inter.demo.entities.Student;
import com.inter.demo.services.StudentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final StudentService studentService;

    public AdminController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/sef/update")
    public Student updateSef(@RequestBody AdminUpdateSefRequest req) {
        return studentService.updateSEF(req.studentId(), req.sefBalance(), req.sefWithdrawalLimit());
    }

    @PostMapping("/assign-mentor")
    public Student assignMentor(@RequestBody AdminAssignMentorRequest req) {
        return studentService.assignMentor(req.studentId(), req.mentorId());
    }
}
