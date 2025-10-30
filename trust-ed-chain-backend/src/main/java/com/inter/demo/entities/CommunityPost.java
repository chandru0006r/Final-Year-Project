package com.inter.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "community_posts", indexes = {@Index(columnList = "communityId")})
public class CommunityPost {
    @Id
    private String id; // e.g., msg-123 or poll-123

    private String communityId;
    private String type; // message | poll

    // common
    private String studentId;

    // message
    private String text;

    // poll
    private String title;
    private Long amount;
    private Integer votesFor;
    private Integer votesAgainst;
    private String status; // open | funded

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCommunityId() { return communityId; }
    public void setCommunityId(String communityId) { this.communityId = communityId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
    public Integer getVotesFor() { return votesFor; }
    public void setVotesFor(Integer votesFor) { this.votesFor = votesFor; }
    public Integer getVotesAgainst() { return votesAgainst; }
    public void setVotesAgainst(Integer votesAgainst) { this.votesAgainst = votesAgainst; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
