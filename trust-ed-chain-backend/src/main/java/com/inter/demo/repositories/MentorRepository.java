package com.inter.demo.repositories;

import com.inter.demo.entities.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorRepository extends JpaRepository<Mentor, String> {
}
