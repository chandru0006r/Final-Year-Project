package com.inter.demo.trusted.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {
    @Id
    private String id; // external-facing id like "stu-001"

    private String name;
    private String email;
    private String college;

    private String mentorId;

    private Integer trustScore = 70;

    private Integer sefBalance = 0; // in INR
    private Integer sefWithdrawalLimit = 1000; // per semester

    private Boolean kycVerified = false;

    private Integer academicPerformance = 70; // 0-100


    public Student() {}

    public Student(String id, String name, String email, String college) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.college = college;
    }

    // getters and setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getMentorId() { return mentorId; }
    public void setMentorId(String mentorId) { this.mentorId = mentorId; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public Integer getSefBalance() { return sefBalance; }
    public void setSefBalance(Integer sefBalance) { this.sefBalance = sefBalance; }

    public Integer getSefWithdrawalLimit() { return sefWithdrawalLimit; }
    public void setSefWithdrawalLimit(Integer sefWithdrawalLimit) { this.sefWithdrawalLimit = sefWithdrawalLimit; }

    public Boolean getKycVerified() { return kycVerified; }
    public void setKycVerified(Boolean kycVerified) { this.kycVerified = kycVerified; }

    public Integer getAcademicPerformance() { return academicPerformance; }
    public void setAcademicPerformance(Integer academicPerformance) { this.academicPerformance = academicPerformance; }

    // Remarks stored separately
}
