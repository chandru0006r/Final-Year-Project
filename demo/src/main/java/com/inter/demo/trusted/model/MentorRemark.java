package com.inter.demo.trusted.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "mentor_remarks")
public class MentorRemark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId;

    @Column(length = 2000)
    private String text;

    private Instant createdAt = Instant.now();

    public MentorRemark() {}

    public MentorRemark(String studentId, String text) {
        this.studentId = studentId;
        this.text = text;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
