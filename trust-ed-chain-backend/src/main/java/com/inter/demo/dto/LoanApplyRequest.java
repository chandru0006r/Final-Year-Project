package com.inter.demo.dto;

import java.util.List;

public record LoanApplyRequest(String studentId, Long amount, String purpose, List<String> documents, Integer trustScore, String college) { }
