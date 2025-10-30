package com.inter.demo.trusted.service;

import com.inter.demo.trusted.model.AuditLog;
import com.inter.demo.trusted.repo.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditLogRepository repo;

    public AuditService(AuditLogRepository repo) {
        this.repo = repo;
    }

    public void log(String actorId, String role, String action, String entityType, String entityId, String details) {
        AuditLog log = new AuditLog();
        log.setActorId(actorId);
        log.setActorRole(role);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        repo.save(log);
    }
}
