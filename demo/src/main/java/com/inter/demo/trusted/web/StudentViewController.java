package com.inter.demo.trusted.web;

import com.inter.demo.trusted.model.InvestorLoan;
import com.inter.demo.trusted.service.AuditService;
import com.inter.demo.trusted.service.LoanService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentViewController {
    private final LoanService loans;
    private final AuditService audit;

    public StudentViewController(LoanService loans, AuditService audit) {
        this.loans = loans;
        this.audit = audit;
    }

    @GetMapping("/requests")
    public List<Map<String,Object>> list(@RequestParam String studentId) {
        return loans.listStudentRequests(studentId);
    }

    public record Approve(@NotBlank String loanId, @NotBlank String investorId) {}

    @PostMapping("/approve-view")
    public ResponseEntity<InvestorLoan> approve(@RequestBody Approve req) {
        InvestorLoan updated = loans.approveView(req.loanId(), req.investorId());
        audit.log(req.investorId(), "student", "APPROVE_VIEW", "InvestorLoan", req.loanId(), "");
        return ResponseEntity.ok(updated);
    }
}
