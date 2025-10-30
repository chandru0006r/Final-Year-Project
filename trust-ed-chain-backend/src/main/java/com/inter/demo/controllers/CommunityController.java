package com.inter.demo.controllers;

import com.inter.demo.entities.Community;
import com.inter.demo.entities.CommunityPost;
import com.inter.demo.services.CommunityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/communities")
public class CommunityController {
    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public List<Map<String, Object>> list() {
        return communityService.listCommunities().stream().map(c -> Map.of(
                "id", c.community().getId(),
                "name", c.community().getName(),
                "description", c.community().getDescription(),
                "scope", c.community().getScope(),
                "creatorId", c.community().getCreatorId(),
                "members", c.community().getMembers(),
                "posts", c.posts()
        )).toList();
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Community payload) {
        var saved = communityService.create(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.community().getId(),
                "name", saved.community().getName(),
                "description", saved.community().getDescription(),
                "scope", saved.community().getScope(),
                "creatorId", saved.community().getCreatorId(),
                "members", saved.community().getMembers(),
                "posts", saved.posts()
        ));
    }

    @PostMapping("/join")
    public Map<String, Object> join(@RequestBody Map<String, String> body) {
        var saved = communityService.join(body.get("communityId"), body.get("studentId"));
        return Map.of(
                "id", saved.community().getId(),
                "name", saved.community().getName(),
                "description", saved.community().getDescription(),
                "scope", saved.community().getScope(),
                "creatorId", saved.community().getCreatorId(),
                "members", saved.community().getMembers(),
                "posts", saved.posts()
        );
    }

    @PostMapping("/add-member")
    public Map<String, Object> addMember(@RequestBody Map<String, String> body) {
        var saved = communityService.addMember(body.get("communityId"), body.get("memberId"));
        return Map.of(
                "id", saved.community().getId(),
                "name", saved.community().getName(),
                "description", saved.community().getDescription(),
                "scope", saved.community().getScope(),
                "creatorId", saved.community().getCreatorId(),
                "members", saved.community().getMembers(),
                "posts", saved.posts()
        );
    }

    @PostMapping("/leave")
    public Map<String, Object> leave(@RequestBody Map<String, String> body) {
        var saved = communityService.leave(body.get("communityId"), body.get("studentId"));
        return Map.of(
                "id", saved.community().getId(),
                "name", saved.community().getName(),
                "description", saved.community().getDescription(),
                "scope", saved.community().getScope(),
                "creatorId", saved.community().getCreatorId(),
                "members", saved.community().getMembers(),
                "posts", saved.posts()
        );
    }

    @PostMapping("/message")
    public ResponseEntity<CommunityPost> message(@RequestBody Map<String, String> body) {
        var saved = communityService.message(body.get("communityId"), body.get("text"), body.get("studentId"));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/poll")
    public ResponseEntity<CommunityPost> poll(@RequestBody Map<String, Object> body) {
        String communityId = (String) body.get("communityId");
        String studentId = (String) body.get("studentId");
        String title = (String) body.get("title");
        Long amount = body.get("amount") == null ? 0L : Long.valueOf(String.valueOf(body.get("amount")));
        var saved = communityService.poll(communityId, title, amount, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
