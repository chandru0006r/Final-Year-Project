package com.inter.demo.entities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    private String id; // e.g., "loan-1001"

    private String studentId;
    private Long amount;
    private String purpose;

    private String status; // pending, mentor-approved, approved, funded

    private boolean mentorApproved;
    private boolean adminApproved;
    private boolean investorFunded;

    private Double interestRate;
    private String college;
    private Integer trustScore;
    private boolean isBigLoan;

    private String blockchainTxHash;

    @ElementCollection
    @CollectionTable(name = "loan_documents", joinColumns = @JoinColumn(name = "loan_id"))
    private List<String> documents = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "loan_view_requests", joinColumns = @JoinColumn(name = "loan_id"))
    private List<ViewRequest> viewRequests = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isMentorApproved() { return mentorApproved; }
    public void setMentorApproved(boolean mentorApproved) { this.mentorApproved = mentorApproved; }
    public boolean isAdminApproved() { return adminApproved; }
    public void setAdminApproved(boolean adminApproved) { this.adminApproved = adminApproved; }
    public boolean isInvestorFunded() { return investorFunded; }
    public void setInvestorFunded(boolean investorFunded) { this.investorFunded = investorFunded; }
    public Double getInterestRate() { return interestRate; }
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }
    public boolean isBigLoan() { return isBigLoan; }
    public void setBigLoan(boolean bigLoan) { isBigLoan = bigLoan; }
    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }
    public List<String> getDocuments() { return documents; }
    public void setDocuments(List<String> documents) { this.documents = documents; }
    public List<ViewRequest> getViewRequests() { return viewRequests; }
    public void setViewRequests(List<ViewRequest> viewRequests) { this.viewRequests = viewRequests; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @Embeddable
    public static class ViewRequest {
        private String investorId;
        private String investorName;
        private String investorEmail;
        private String status; // pending, approved
        private Instant requestedAt;

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
}
