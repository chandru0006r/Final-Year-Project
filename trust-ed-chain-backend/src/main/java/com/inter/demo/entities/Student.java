package com.inter.demo.entities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "students")
public class Student {

    @Id
    private String id; // e.g., "stu-001"

    @NotBlank
    private String name;

    @Email
    private String email;

    private String college;

    private Double cgpa;

    private String department;

    private Integer semester;

    private Integer trustScore;

    private Integer trustAcademics;
    private Integer trustRepayments;
    private Integer trustMentorRating;

    private Long sefBalance; // in INR

    private Long sefWithdrawalLimit; // in INR (per semester)

    private String mentorId; // e.g., "men-101"

    @ElementCollection
    @CollectionTable(name = "student_communities", joinColumns = @JoinColumn(name = "student_id"))
    private Set<String> communities = new HashSet<>();

    private boolean kycVerified;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_remarks", joinColumns = @JoinColumn(name = "student_id"))
    private List<Remark> mentorRemarks = new ArrayList<>();

    private Instant updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }
    public Integer getTrustAcademics() { return trustAcademics; }
    public void setTrustAcademics(Integer trustAcademics) { this.trustAcademics = trustAcademics; }
    public Integer getTrustRepayments() { return trustRepayments; }
    public void setTrustRepayments(Integer trustRepayments) { this.trustRepayments = trustRepayments; }
    public Integer getTrustMentorRating() { return trustMentorRating; }
    public void setTrustMentorRating(Integer trustMentorRating) { this.trustMentorRating = trustMentorRating; }
    public Long getSefBalance() { return sefBalance; }
    public void setSefBalance(Long sefBalance) { this.sefBalance = sefBalance; }
    public Long getSefWithdrawalLimit() { return sefWithdrawalLimit; }
    public void setSefWithdrawalLimit(Long sefWithdrawalLimit) { this.sefWithdrawalLimit = sefWithdrawalLimit; }
    public String getMentorId() { return mentorId; }
    public void setMentorId(String mentorId) { this.mentorId = mentorId; }
    public Set<String> getCommunities() { return communities; }
    public void setCommunities(Set<String> communities) { this.communities = communities; }
    public boolean isKycVerified() { return kycVerified; }
    public void setKycVerified(boolean kycVerified) { this.kycVerified = kycVerified; }
    public List<Remark> getMentorRemarks() { return mentorRemarks; }
    public void setMentorRemarks(List<Remark> mentorRemarks) { this.mentorRemarks = mentorRemarks; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @Embeddable
    public static class Remark {
        private String id;
        private String text;
        private Instant at;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public Instant getAt() { return at; }
        public void setAt(Instant at) { this.at = at; }
    }
}
