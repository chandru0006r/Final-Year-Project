package com.inter.demo.trusted.repo;

import com.inter.demo.trusted.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
