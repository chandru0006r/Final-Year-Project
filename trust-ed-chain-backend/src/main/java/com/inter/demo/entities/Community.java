package com.inter.demo.entities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "communities")
public class Community {

    @Id
    private String id; // e.g., com-11
    private String name;
    private String description;
    private String scope; // institution | friends
    private String creatorId; // student id

    @ElementCollection
    @CollectionTable(name = "community_members", joinColumns = @JoinColumn(name = "community_id"))
    private List<String> members = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }
    public String getCreatorId() { return creatorId; }
    public void setCreatorId(String creatorId) { this.creatorId = creatorId; }
    public List<String> getMembers() { return members; }
    public void setMembers(List<String> members) { this.members = members; }
}
