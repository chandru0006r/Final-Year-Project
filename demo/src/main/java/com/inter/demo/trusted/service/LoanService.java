package com.inter.demo.trusted.service;

import com.inter.demo.trusted.model.InvestorLoan;
import com.inter.demo.trusted.model.LoanViewRequest;
import com.inter.demo.trusted.repo.InvestorLoanRepository;
import com.inter.demo.trusted.repo.LoanViewRequestRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class LoanService {
    private final InvestorLoanRepository loans;
    private final LoanViewRequestRepository viewRequests;

    public LoanService(InvestorLoanRepository loans, LoanViewRequestRepository viewRequests) {
        this.loans = loans;
        this.viewRequests = viewRequests;
    }

    public List<InvestorLoan> list() { return loans.findAll(); }

    public Optional<InvestorLoan> get(String id) { return loans.findById(id); }

    public InvestorLoan create(InvestorLoan l) { return loans.save(l); }

    public InvestorLoan setMentorApproved(String loanId) {
        InvestorLoan loan = loans.findById(loanId).orElseThrow();
        loan.setMentorApproved(true);
        loan.setStatus(Boolean.TRUE.equals(loan.getBigLoan()) ? "mentor-approved" : "approved");
        return loans.save(loan);
    }

    public InvestorLoan setAdminApproved(String loanId) {
        InvestorLoan loan = loans.findById(loanId).orElseThrow();
        loan.setAdminApproved(true);
        loan.setStatus("approved");
        return loans.save(loan);
    }

    public InvestorLoan markFunded(String loanId, String txHash, String contractAddress) {
        InvestorLoan loan = loans.findById(loanId).orElseThrow();
        loan.setInvestorFunded(true);
        loan.setStatus("funded");
        loan.setBlockchainTxHash(txHash);
        loan.setBlockchainContractAddress(contractAddress);
        loan.setFundedAt(Instant.now());
        return loans.save(loan);
    }

    public LoanViewRequest requestView(String loanId, String investorId, String investorName, String investorEmail) {
        List<LoanViewRequest> existing = viewRequests.findByLoanId(loanId);
        Optional<LoanViewRequest> same = existing.stream().filter(v -> Objects.equals(v.getInvestorId(), investorId)).findFirst();
        LoanViewRequest req = same.orElseGet(() -> new LoanViewRequest(loanId, investorId, investorName, investorEmail));
        req.setStatus("pending");
        return viewRequests.save(req);
    }

    public List<Map<String,Object>> listInvestorRequests(String investorId) {
        List<Map<String,Object>> result = new ArrayList<>();
        for (InvestorLoan loan : loans.findAll()) {
            for (LoanViewRequest r : viewRequests.findByLoanId(loan.getId())) {
                if (Objects.equals(r.getInvestorId(), investorId)) {
                    Map<String,Object> m = new LinkedHashMap<>();
                    m.put("loanId", loan.getId());
                    m.put("purpose", loan.getPurpose());
                    m.put("amount", loan.getAmount());
                    m.put("college", loan.getCollege());
                    m.put("status", r.getStatus());
                    m.put("investorId", r.getInvestorId());
                    m.put("investorName", r.getInvestorName());
                    m.put("investorEmail", r.getInvestorEmail());
                    result.add(m);
                }
            }
        }
        return result;
    }

    public List<Map<String,Object>> listStudentRequests(String studentId) {
        List<Map<String,Object>> result = new ArrayList<>();
        for (InvestorLoan loan : loans.findByStudentId(studentId)) {
            for (LoanViewRequest r : viewRequests.findByLoanId(loan.getId())) {
                Map<String,Object> m = new LinkedHashMap<>();
                m.put("loanId", loan.getId());
                m.put("purpose", loan.getPurpose());
                m.put("amount", loan.getAmount());
                m.put("college", loan.getCollege());
                m.put("status", r.getStatus());
                m.put("investorId", r.getInvestorId());
                m.put("investorName", r.getInvestorName());
                m.put("investorEmail", r.getInvestorEmail());
                result.add(m);
            }
        }
        return result;
    }

    public InvestorLoan approveView(String loanId, String investorId) {
        for (LoanViewRequest r : viewRequests.findByLoanId(loanId)) {
            if (Objects.equals(r.getInvestorId(), investorId)) {
                r.setStatus("approved");
                viewRequests.save(r);
            }
        }
        return loans.findById(loanId).orElseThrow();
    }
}
