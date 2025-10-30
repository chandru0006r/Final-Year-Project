package com.inter.demo.repositories;

import com.inter.demo.entities.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, String> {
    List<CommunityPost> findByCommunityId(String communityId);
}
