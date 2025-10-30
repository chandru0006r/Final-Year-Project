package com.inter.demo.controllers;

import com.inter.demo.dto.LoanApplyRequest;
import com.inter.demo.dto.LoanIdRequest;
import com.inter.demo.entities.Loan;
import com.inter.demo.services.LoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    public List<Loan> list() { return loanService.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> get(@PathVariable String id) {
        return loanService.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/apply")
    public ResponseEntity<Loan> apply(@RequestBody LoanApplyRequest req) {
        Loan saved = loanService.apply(new LoanService.ApplyLoanPayload(req.studentId(), req.amount(), req.purpose(), req.documents(), req.trustScore(), req.college()));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/mentor-approve")
    public Loan mentorApprove(@RequestBody LoanIdRequest req) { return loanService.mentorApprove(req.loanId()); }

    @PostMapping("/admin-approve")
    public Loan adminApprove(@RequestBody LoanIdRequest req) { return loanService.adminApprove(req.loanId()); }

    @PostMapping("/fund")
    public Loan fund(@RequestBody LoanIdRequest req) { return loanService.fund(req.loanId()); }
}
