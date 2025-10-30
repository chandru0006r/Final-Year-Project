package com.inter.demo.trusted.web.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class Requests {
    public record UpdateSef(@NotBlank String studentId, Integer sefBalance, Integer sefWithdrawalLimit) {}
    public record AssignMentor(@NotBlank String studentId, @NotBlank String mentorId) {}
    public record VerifyKyc(@NotBlank String studentId, boolean verified) {}
    public record MentorRemark(@NotBlank String studentId, @NotBlank String text) {}
    public record SefWithdraw(@NotBlank String studentId, @Min(1) int amount) {}

    public record LoanApply(
            @NotBlank String studentId,
            @NotNull @Min(1) Integer amount,
            @NotBlank String purpose,
            Integer trustScore,
            String college,
            List<String> documents
    ) {}
    public record ApproveLoan(@NotBlank String loanId) {}
    public record FundLoan(@NotBlank String loanId) {}

    public record InvestorRequestView(@NotBlank String loanId, @NotBlank String investorId, @NotBlank String investorName, @Email String investorEmail) {}
    public record ApproveView(@NotBlank String loanId, @NotBlank String investorId) {}

    public record CommunityCreate(@NotBlank String id, @NotBlank String name, String description, String scope) {}
    public record CommunityJoin(@NotBlank String communityId, @NotBlank String studentId) {}
    public record CommunityAddMember(@NotBlank String communityId, @NotBlank String memberId) {}
    public record CommunityLeave(@NotBlank String communityId, @NotBlank String studentId) {}
    public record CommunityMessage(@NotBlank String communityId, @NotBlank String studentId, @NotBlank String text) {}
    public record CommunityPoll(@NotBlank String communityId, @NotBlank String studentId, @NotBlank String title, @NotNull @Min(1) Integer amount) {}
}
