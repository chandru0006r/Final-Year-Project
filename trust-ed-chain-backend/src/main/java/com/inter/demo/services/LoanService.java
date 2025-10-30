package com.inter.demo.services;

import com.inter.demo.entities.Loan;
import com.inter.demo.repositories.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final BlockchainService blockchainService;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public LoanService(LoanRepository loanRepository,
                       BlockchainService blockchainService,
                       AuditService auditService,
                       NotificationService notificationService) {
        this.loanRepository = loanRepository;
        this.blockchainService = blockchainService;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    public List<Loan> getAll() {
        return loanRepository.findAll();
    }

    public Optional<Loan> getById(String id) {
        return loanRepository.findById(id);
    }

    @Transactional
    public Loan apply(ApplyLoanPayload payload) {
        boolean big = payload.amount() != null && payload.amount() > 20000;
        double rate = Math.max(8, Math.min(20, 20 - Math.floor((payload.trustScore() == null ? 70 : payload.trustScore()) / 5.0)));
        Loan loan = new Loan();
        loan.setId("loan-" + Math.abs(UUID.randomUUID().getMostSignificantBits()));
        loan.setStudentId(payload.studentId());
        loan.setAmount(payload.amount());
        loan.setPurpose(payload.purpose());
        loan.setMentorApproved(false);
        loan.setInvestorFunded(false);
        loan.setAdminApproved(!big);
        loan.setInterestRate(rate);
        loan.setCollege(payload.college());
        loan.setTrustScore(payload.trustScore());
        loan.setBigLoan(big);
        loan.setStatus("pending");
        loan.setDocuments(new ArrayList<>(payload.documents() == null ? List.of() : payload.documents()));
        loan.setCreatedAt(Instant.now());
        loan.setUpdatedAt(Instant.now());
        Loan saved = loanRepository.save(loan);
        auditService.log("LOAN_APPLY", "loanId=" + saved.getId());
        notificationService.send("mentor@college.edu", "New loan application", "Loan " + saved.getId() + " awaiting review");
        return saved;
    }

    @Transactional
    public Loan mentorApprove(String loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        loan.setMentorApproved(true);
        loan.setStatus(loan.isBigLoan() ? "mentor-approved" : "approved");
        loan.setUpdatedAt(Instant.now());
        Loan saved = loanRepository.save(loan);
        auditService.log("LOAN_MENTOR_APPROVE", "loanId=" + loanId);
        notificationService.send("admin@platform.local", "Mentor approved loan", "Loan " + loanId + " approved by mentor");
        return saved;
    }

    @Transactional
    public Loan adminApprove(String loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        loan.setAdminApproved(true);
        loan.setStatus("approved");
        loan.setUpdatedAt(Instant.now());
        Loan saved = loanRepository.save(loan);
        auditService.log("LOAN_ADMIN_APPROVE", "loanId=" + loanId);
        return saved;
    }

    @Transactional
    public Loan fund(String loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        // Only big loans go on-chain
        if (loan.isBigLoan()) {
            String txHash = blockchainService.recordInvestorLoanOnChain(loan);
            loan.setBlockchainTxHash(txHash);
        }
        loan.setInvestorFunded(true);
        loan.setStatus("funded");
        loan.setUpdatedAt(Instant.now());
        Loan saved = loanRepository.save(loan);
        auditService.log("LOAN_FUNDED", "loanId=" + loanId + ", txHash=" + (saved.getBlockchainTxHash() == null ? "" : saved.getBlockchainTxHash()));
        notificationService.send("student@college.edu", "Loan funded", "Your loan " + loanId + " has been funded");
        return saved;
    }

    @Transactional
    public Loan requestView(String loanId, String investorId, String investorName, String investorEmail) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        List<Loan.ViewRequest> v = loan.getViewRequests();
        Loan.ViewRequest existing = v.stream().filter(r -> investorId.equals(r.getInvestorId())).findFirst().orElse(null);
        if (existing == null) {
            Loan.ViewRequest req = new Loan.ViewRequest();
            req.setInvestorId(investorId);
            req.setInvestorName(investorName);
            req.setInvestorEmail(investorEmail);
            req.setStatus("pending");
            req.setRequestedAt(Instant.now());
            v.add(req);
        }
        loan.setUpdatedAt(Instant.now());
        Loan saved = loanRepository.save(loan);
        auditService.log("INVESTOR_REQUEST_VIEW", "loanId=" + loanId + ", investorId=" + investorId);
        return saved;
    }

    @Transactional
    public Loan approveView(String loanId, String investorId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        for (Loan.ViewRequest r : loan.getViewRequests()) {
            if (investorId.equals(r.getInvestorId())) {
                r.setStatus("approved");
            }
        }
        loan.setUpdatedAt(Instant.now());
        Loan saved = loanRepository.save(loan);
        auditService.log("STUDENT_APPROVE_VIEW", "loanId=" + loanId + ", investorId=" + investorId);
        return saved;
    }

    public List<InvestorRequestItem> requestsForInvestor(String investorId) {
        List<InvestorRequestItem> out = new ArrayList<>();
        for (Loan loan : loanRepository.findAll()) {
            for (Loan.ViewRequest r : loan.getViewRequests()) {
                if (investorId.equals(r.getInvestorId())) {
                    out.add(new InvestorRequestItem(loan.getId(), loan.getPurpose(), loan.getAmount(), loan.getCollege(), r.getStatus(), r.getInvestorId(), r.getInvestorName(), r.getInvestorEmail()));
                }
            }
        }
        return out;
    }

    public List<StudentRequestItem> requestsForStudent(String studentId) {
        List<StudentRequestItem> out = new ArrayList<>();
        for (Loan loan : loanRepository.findByStudentId(studentId)) {
            for (Loan.ViewRequest r : loan.getViewRequests()) {
                out.add(new StudentRequestItem(loan.getId(), loan.getPurpose(), loan.getAmount(), loan.getCollege(), r.getStatus(), r.getInvestorId(), r.getInvestorName(), r.getInvestorEmail()));
            }
        }
        return out;
    }

    public record ApplyLoanPayload(String studentId, Long amount, String purpose, List<String> documents, Integer trustScore, String college) { }

    public record InvestorRequestItem(String loanId, String purpose, Long amount, String college, String status, String investorId, String investorName, String investorEmail) { }

    public record StudentRequestItem(String loanId, String purpose, Long amount, String college, String status, String investorId, String investorName, String investorEmail) { }
}
