package com.inter.demo.trusted.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "investor_loans")
public class InvestorLoan {
    @Id
    private String id; // like loan-123

    private String studentId;
    private String purpose;
    private Integer amount; // INR

    private Boolean mentorApproved = false;
    private Boolean adminApproved = false;
    private Boolean investorFunded = false;

    private String status = "pending"; // pending, mentor-approved, approved, funded

    private Integer interestRate; // percentage

    private Boolean bigLoan = false; // whether on-chain required

    private String college;

    private Integer trustScore;

    // Blockchain
    private String blockchainTxHash;
    private String blockchainContractAddress;
    private Instant fundedAt;

    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "loanId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoanViewRequest> viewRequests = new ArrayList<>();

    public InvestorLoan() {}

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }

    public Boolean getMentorApproved() { return mentorApproved; }
    public void setMentorApproved(Boolean mentorApproved) { this.mentorApproved = mentorApproved; }

    public Boolean getAdminApproved() { return adminApproved; }
    public void setAdminApproved(Boolean adminApproved) { this.adminApproved = adminApproved; }

    public Boolean getInvestorFunded() { return investorFunded; }
    public void setInvestorFunded(Boolean investorFunded) { this.investorFunded = investorFunded; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getInterestRate() { return interestRate; }
    public void setInterestRate(Integer interestRate) { this.interestRate = interestRate; }

    public Boolean getBigLoan() { return bigLoan; }
    public void setBigLoan(Boolean bigLoan) { this.bigLoan = bigLoan; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }

    public String getBlockchainContractAddress() { return blockchainContractAddress; }
    public void setBlockchainContractAddress(String blockchainContractAddress) { this.blockchainContractAddress = blockchainContractAddress; }

    public Instant getFundedAt() { return fundedAt; }
    public void setFundedAt(Instant fundedAt) { this.fundedAt = fundedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<LoanViewRequest> getViewRequests() { return viewRequests; }
    public void setViewRequests(List<LoanViewRequest> viewRequests) { this.viewRequests = viewRequests; }
}
