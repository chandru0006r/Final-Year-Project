package com.inter.demo.repositories;

import com.inter.demo.entities.Community;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRepository extends JpaRepository<Community, String> { }
