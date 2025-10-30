package com.inter.demo.services;

import com.inter.demo.entities.Community;
import com.inter.demo.entities.CommunityPost;
import com.inter.demo.repositories.CommunityPostRepository;
import com.inter.demo.repositories.CommunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CommunityService {
    private final CommunityRepository communityRepository;
    private final CommunityPostRepository communityPostRepository;

    public CommunityService(CommunityRepository communityRepository, CommunityPostRepository communityPostRepository) {
        this.communityRepository = communityRepository;
        this.communityPostRepository = communityPostRepository;
    }

    public List<CommunityWithPosts> listCommunities() {
        List<CommunityWithPosts> out = new ArrayList<>();
        for (Community c : communityRepository.findAll()) {
            out.add(new CommunityWithPosts(c, communityPostRepository.findByCommunityId(c.getId())));
        }
        return out;
    }

    @Transactional
    public CommunityWithPosts create(Community payload) {
        if (payload.getId() == null || payload.getId().isBlank()) {
            payload.setId("com-" + Math.abs(UUID.randomUUID().getMostSignificantBits()));
        }
        if (payload.getMembers() == null) payload.setMembers(new ArrayList<>());
        Community saved = communityRepository.save(payload);
        return new CommunityWithPosts(saved, List.of());
    }

    @Transactional
    public CommunityWithPosts join(String communityId, String studentId) {
        Community c = communityRepository.findById(communityId).orElseThrow();
        if (!c.getMembers().contains(studentId)) c.getMembers().add(studentId);
        Community saved = communityRepository.save(c);
        return new CommunityWithPosts(saved, communityPostRepository.findByCommunityId(communityId));
    }

    @Transactional
    public CommunityWithPosts addMember(String communityId, String memberId) {
        return join(communityId, memberId);
    }

    @Transactional
    public CommunityWithPosts leave(String communityId, String studentId) {
        Community c = communityRepository.findById(communityId).orElseThrow();
        c.getMembers().removeIf(m -> m.equals(studentId));
        Community saved = communityRepository.save(c);
        return new CommunityWithPosts(saved, communityPostRepository.findByCommunityId(communityId));
    }

    @Transactional
    public CommunityPost message(String communityId, String text, String studentId) {
        CommunityPost post = new CommunityPost();
        post.setId("msg-" + Math.abs(UUID.randomUUID().getMostSignificantBits()));
        post.setCommunityId(communityId);
        post.setType("message");
        post.setText(text);
        post.setStudentId(studentId);
        return communityPostRepository.save(post);
    }

    @Transactional
    public CommunityPost poll(String communityId, String title, Long amount, String studentId) {
        CommunityPost post = new CommunityPost();
        post.setId("poll-" + Math.abs(UUID.randomUUID().getMostSignificantBits()));
        post.setCommunityId(communityId);
        post.setType("poll");
        post.setTitle(title);
        post.setAmount(amount);
        post.setStudentId(studentId);
        post.setVotesFor(0);
        post.setVotesAgainst(0);
        post.setStatus("open");
        return communityPostRepository.save(post);
    }

    public record CommunityWithPosts(Community community, List<CommunityPost> posts) { }
}
