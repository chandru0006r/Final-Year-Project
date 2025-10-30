package com.inter.demo.trusted.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "communities")
public class Community {
    @Id
    private String id; // e.g., com-123

    private String name;
    @Column(length = 1000)
    private String description;

    private String scope; // friends, class, hostel, etc.

    @ElementCollection
    @CollectionTable(name = "community_members", joinColumns = @JoinColumn(name = "community_id"))
    @Column(name = "member_id")
    private List<String> members = new ArrayList<>();

    @Transient
    private List<CommunityPost> posts = new ArrayList<>();

    public Community() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }
    public List<String> getMembers() { return members; }
    public void setMembers(List<String> members) { this.members = members; }
    public List<CommunityPost> getPosts() { return posts; }
    public void setPosts(List<CommunityPost> posts) { this.posts = posts; }
}
