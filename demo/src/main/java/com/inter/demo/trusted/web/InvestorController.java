package com.inter.demo.trusted.web;

import com.inter.demo.trusted.model.InvestorLoan;
import com.inter.demo.trusted.service.AuditService;
import com.inter.demo.trusted.service.LoanService;
import com.inter.demo.trusted.web.dto.Requests;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investor")
public class InvestorController {
    private final LoanService loans;
    private final AuditService audit;

    public InvestorController(LoanService loans, AuditService audit) {
        this.loans = loans;
        this.audit = audit;
    }

    @PostMapping("/request-view")
    public ResponseEntity<InvestorLoan> requestView(@RequestBody @Valid Requests.InvestorRequestView req) {
        loans.requestView(req.loanId(), req.investorId(), req.investorName(), req.investorEmail());
        audit.log(req.investorId(), "investor", "REQUEST_VIEW", "InvestorLoan", req.loanId(), req.investorEmail());
        return loans.get(req.loanId()).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/requests")
    public List<Map<String,Object>> listRequests(@RequestParam String investorId) {
        return loans.listInvestorRequests(investorId);
    }
}
