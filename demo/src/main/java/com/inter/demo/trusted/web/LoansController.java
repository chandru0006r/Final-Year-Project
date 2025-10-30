package com.inter.demo.trusted.web;

import com.inter.demo.trusted.model.InvestorLoan;
import com.inter.demo.trusted.service.AuditService;
import com.inter.demo.trusted.service.BlockchainService;
import com.inter.demo.trusted.service.LoanService;
import com.inter.demo.trusted.service.NotificationService;
import com.inter.demo.trusted.web.dto.Requests;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/loans")
public class LoansController {
    private final LoanService loans;
    private final AuditService audit;
    private final BlockchainService chain;
    private final NotificationService notifications;

    public LoansController(LoanService loans, AuditService audit, BlockchainService chain, NotificationService notifications) {
        this.loans = loans;
        this.audit = audit;
        this.chain = chain;
        this.notifications = notifications;
    }

    @GetMapping
    public List<InvestorLoan> list() { return loans.list(); }

    @GetMapping("/{id}")
    public ResponseEntity<InvestorLoan> get(@PathVariable String id) {
        return loans.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/apply")
    public ResponseEntity<InvestorLoan> apply(@RequestBody @Valid Requests.LoanApply req) {
        boolean isBig = (req.amount() != null && req.amount() > 20000);
        InvestorLoan l = new InvestorLoan();
        l.setId("loan-" + (int)(Math.random()*100000));
        l.setStudentId(req.studentId());
        l.setPurpose(req.purpose());
        l.setAmount(req.amount());
        l.setBigLoan(isBig);
        int trust = Optional.ofNullable(req.trustScore()).orElse(70);
        l.setTrustScore(trust);
        l.setCollege(Optional.ofNullable(req.college()).orElse("ABC College"));
        int rate = Math.max(8, Math.min(20, 20 - (trust / 5)));
        l.setInterestRate(rate);
        l.setAdminApproved(!isBig);
        l.setStatus(!isBig ? "approved" : "pending");
        InvestorLoan saved = loans.create(l);
        audit.log(req.studentId(), "student", "LOAN_APPLY", "InvestorLoan", saved.getId(), "amount=" + req.amount());
        return ResponseEntity.status(201).body(saved);
    }

    @PostMapping("/mentor-approve")
    public ResponseEntity<InvestorLoan> mentorApprove(@RequestBody @Valid Requests.ApproveLoan req) {
        InvestorLoan updated = loans.setMentorApproved(req.loanId());
        audit.log("system", "mentor", "MENTOR_APPROVE", "InvestorLoan", updated.getId(), "");
        notifications.notify("mentor@example.edu", "Loan mentor approved", "Loan " + updated.getId() + " approved by mentor");
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/admin-approve")
    public ResponseEntity<InvestorLoan> adminApprove(@RequestBody @Valid Requests.ApproveLoan req) {
        InvestorLoan updated = loans.setAdminApproved(req.loanId());
        audit.log("system", "admin", "ADMIN_APPROVE", "InvestorLoan", updated.getId(), "");
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/fund")
    public ResponseEntity<InvestorLoan> fund(@RequestBody @Valid Requests.FundLoan req) {
        InvestorLoan loan = loans.get(req.loanId()).orElse(null);
        if (loan == null) return ResponseEntity.notFound().build();
        String tx = chain.recordLoanOnChain(loan).orElse("0x");
        InvestorLoan updated = loans.markFunded(loan.getId(), tx, chain.getConfiguredContractAddress());
        audit.log("system", "investor", "INVESTOR_FUNDED", "InvestorLoan", updated.getId(), "tx=" + tx + ", at=" + Instant.now());
        notifications.notify("investor@example.com", "Loan funded on-chain", "Loan " + updated.getId() + " funded. tx=" + tx);
        return ResponseEntity.ok(updated);
    }
}
