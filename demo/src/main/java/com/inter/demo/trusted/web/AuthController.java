package com.inter.demo.trusted.web;

import com.inter.demo.trusted.security.JwtService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtService jwt;

    public AuthController(JwtService jwt) { this.jwt = jwt; }

    public record Login(@NotBlank String role, @Email String email, @NotBlank String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login req) {
        // Demo: accept any credentials and issue JWT
        String token = jwt.issue(req.email(), req.role(), Map.of("email", req.email()));
        return ResponseEntity.ok(Map.of("token", token, "role", req.role(), "email", req.email()));
    }
}
