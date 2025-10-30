package com.inter.demo.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    public void log(String action, String details) {
        // For now, log to console; can be extended to persist in SQL table
        log.info("AUDIT {} :: {}", action, details);
    }
}
