package com.inter.demo.trusted.web;

import com.inter.demo.trusted.model.Community;
import com.inter.demo.trusted.model.CommunityPost;
import com.inter.demo.trusted.service.AuditService;
import com.inter.demo.trusted.service.CommunityService;
import com.inter.demo.trusted.web.dto.Requests;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
public class CommunitiesController {
    private final CommunityService communities;
    private final AuditService audit;

    public CommunitiesController(CommunityService communities, AuditService audit) {
        this.communities = communities;
        this.audit = audit;
    }

    @GetMapping
    public List<Community> list() {
        return communities.list();
    }

    @PostMapping("/create")
    public ResponseEntity<Community> create(@RequestBody @Valid Requests.CommunityCreate req) {
        Community c = new Community();
        c.setId(req.id());
        c.setName(req.name());
        c.setDescription(req.description());
        c.setScope(req.scope());
        Community created = communities.create(c);
        audit.log("system", "student", "COMMUNITY_CREATE", "Community", created.getId(), created.getName());
        return ResponseEntity.status(201).body(created);
    }

    @PostMapping("/join")
    public ResponseEntity<Community> join(@RequestBody @Valid Requests.CommunityJoin req) {
        Community c = communities.get(req.communityId()).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();
        if (!c.getMembers().contains(req.studentId())) c.getMembers().add(req.studentId());
        Community saved = communities.save(c);
        audit.log(req.studentId(), "student", "COMMUNITY_JOIN", "Community", c.getId(), "");
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/add-member")
    public ResponseEntity<Community> addMember(@RequestBody @Valid Requests.CommunityAddMember req) {
        Community c = communities.get(req.communityId()).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();
        if (!c.getMembers().contains(req.memberId())) c.getMembers().add(req.memberId());
        Community saved = communities.save(c);
        audit.log("system", "student", "COMMUNITY_ADD_MEMBER", "Community", c.getId(), req.memberId());
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/leave")
    public ResponseEntity<Community> leave(@RequestBody @Valid Requests.CommunityLeave req) {
        Community c = communities.get(req.communityId()).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();
        c.setMembers(c.getMembers().stream().filter(m -> !m.equals(req.studentId())).toList());
        Community saved = communities.save(c);
        audit.log(req.studentId(), "student", "COMMUNITY_LEAVE", "Community", c.getId(), "");
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/message")
    public ResponseEntity<CommunityPost> message(@RequestBody @Valid Requests.CommunityMessage req) {
        Community c = communities.get(req.communityId()).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();
        CommunityPost p = new CommunityPost();
        p.setCommunityId(c.getId());
        p.setType("message");
        p.setText(req.text());
        p.setStudentId(req.studentId());
        CommunityPost saved = communities.addPost(p);
        audit.log(req.studentId(), "student", "COMMUNITY_MESSAGE", "Community", c.getId(), req.text());
        return ResponseEntity.status(201).body(saved);
    }

    @PostMapping("/poll")
    public ResponseEntity<CommunityPost> poll(@RequestBody @Valid Requests.CommunityPoll req) {
        Community c = communities.get(req.communityId()).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();
        CommunityPost p = new CommunityPost();
        p.setCommunityId(c.getId());
        p.setType("poll");
        p.setTitle(req.title());
        p.setAmount(req.amount());
        p.setStudentId(req.studentId());
        CommunityPost saved = communities.addPost(p);
        audit.log(req.studentId(), "student", "COMMUNITY_POLL", "Community", c.getId(), req.title());
        return ResponseEntity.status(201).body(saved);
    }
}
