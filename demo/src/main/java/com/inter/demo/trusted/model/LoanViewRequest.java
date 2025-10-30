package com.inter.demo.trusted.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "loan_view_requests")
public class LoanViewRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String loanId;

    private String investorId;
    private String investorName;
    private String investorEmail;

    private String status = "pending"; // pending, approved

    private Instant requestedAt = Instant.now();

    public LoanViewRequest() {}

    public LoanViewRequest(String loanId, String investorId, String investorName, String investorEmail) {
        this.loanId = loanId;
        this.investorId = investorId;
        this.investorName = investorName;
        this.investorEmail = investorEmail;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLoanId() { return loanId; }
    public void setLoanId(String loanId) { this.loanId = loanId; }

    public String getInvestorId() { return investorId; }
    public void setInvestorId(String investorId) { this.investorId = investorId; }

    public String getInvestorName() { return investorName; }
    public void setInvestorName(String investorName) { this.investorName = investorName; }

    public String getInvestorEmail() { return investorEmail; }
    public void setInvestorEmail(String investorEmail) { this.investorEmail = investorEmail; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getRequestedAt() { return requestedAt; }
    public void setRequestedAt(Instant requestedAt) { this.requestedAt = requestedAt; }
}
