package com.inter.demo.trusted.repo;

import com.inter.demo.trusted.model.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    java.util.List<CommunityPost> findByCommunityId(String communityId);
}
