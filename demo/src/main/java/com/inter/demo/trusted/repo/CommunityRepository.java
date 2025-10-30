package com.inter.demo.trusted.repo;

import com.inter.demo.trusted.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRepository extends JpaRepository<Community, String> {
}
