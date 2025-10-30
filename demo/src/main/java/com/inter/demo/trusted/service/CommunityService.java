package com.inter.demo.trusted.service;

import com.inter.demo.trusted.model.Community;
import com.inter.demo.trusted.model.CommunityPost;
import com.inter.demo.trusted.repo.CommunityPostRepository;
import com.inter.demo.trusted.repo.CommunityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {
    private final CommunityRepository communities;
    private final CommunityPostRepository posts;

    public CommunityService(CommunityRepository communities, CommunityPostRepository posts) {
        this.communities = communities;
        this.posts = posts;
    }

    public List<Community> list() { return communities.findAll(); }

    public Community create(Community c) { return communities.save(c); }

    public Optional<Community> get(String id) { return communities.findById(id); }

    public Community save(Community c) { return communities.save(c); }

    public CommunityPost addPost(CommunityPost p) { return posts.save(p); }

    public List<CommunityPost> getPosts(String communityId) { return posts.findByCommunityId(communityId); }
}
