package com.inter.demo.trusted.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final Optional<JavaMailSender> mailSender;

    public NotificationService(Optional<JavaMailSender> mailSender) {
        this.mailSender = mailSender;
    }

    public void notify(String toEmail, String subject, String body) {
        if (mailSender.isPresent()) {
            try {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(toEmail);
                msg.setSubject(subject);
                msg.setText(body);
                mailSender.get().send(msg);
                return;
            } catch (Exception e) {
                log.warn("Failed sending email: {}", e.getMessage());
            }
        }
        log.info("[NOTIFY] {} - {} :: {}", toEmail, subject, body);
    }
}
