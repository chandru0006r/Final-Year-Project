package com.inter.demo.controllers;

import com.inter.demo.dto.ApproveViewRequest;
import com.inter.demo.dto.InvestorRequestViewRequest;
import com.inter.demo.entities.Loan;
import com.inter.demo.services.LoanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class InvestorController {

    private final LoanService loanService;

    public InvestorController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/investor/request-view")
    public Loan requestView(@RequestBody InvestorRequestViewRequest req) {
        return loanService.requestView(req.loanId(), req.investorId(), req.investorName(), req.investorEmail());
    }

    @GetMapping("/investor/requests")
    public List<LoanService.InvestorRequestItem> investorRequests(@RequestParam String investorId) {
        return loanService.requestsForInvestor(investorId);
    }

    @GetMapping("/student/requests")
    public List<LoanService.StudentRequestItem> studentRequests(@RequestParam String studentId) {
        return loanService.requestsForStudent(studentId);
    }

    @PostMapping("/student/approve-view")
    public Loan approveView(@RequestBody ApproveViewRequest req) {
        return loanService.approveView(req.loanId(), req.investorId());
    }
}
