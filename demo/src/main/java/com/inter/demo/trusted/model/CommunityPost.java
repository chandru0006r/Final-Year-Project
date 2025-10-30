package com.inter.demo.trusted.model;

import jakarta.persistence.*;

@Entity
@Table(name = "community_posts")
public class CommunityPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String communityId;

    private String type; // message | poll

    // message fields
    @Column(length = 2000)
    private String text;
    private String studentId;

    // poll fields
    private String title;
    private Integer amount;
    private Integer votesFor = 0;
    private Integer votesAgainst = 0;
    private String status = "open"; // open | closed

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCommunityId() { return communityId; }
    public void setCommunityId(String communityId) { this.communityId = communityId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
    public Integer getVotesFor() { return votesFor; }
    public void setVotesFor(Integer votesFor) { this.votesFor = votesFor; }
    public Integer getVotesAgainst() { return votesAgainst; }
    public void setVotesAgainst(Integer votesAgainst) { this.votesAgainst = votesAgainst; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
