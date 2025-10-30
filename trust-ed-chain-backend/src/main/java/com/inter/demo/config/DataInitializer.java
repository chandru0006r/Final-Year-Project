package com.inter.demo.config;

import com.inter.demo.entities.Community;
import com.inter.demo.entities.CommunityPost;
import com.inter.demo.entities.Loan;
import com.inter.demo.entities.Student;
import com.inter.demo.repositories.CommunityPostRepository;
import com.inter.demo.repositories.CommunityRepository;
import com.inter.demo.repositories.LoanRepository;
import com.inter.demo.repositories.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(StudentRepository studentRepository,
                               LoanRepository loanRepository,
                               CommunityRepository communityRepository,
                               CommunityPostRepository communityPostRepository) {
        return args -> {
            if (studentRepository.count() == 0) {
                Student s1 = new Student();
                s1.setId("stu-001");
                s1.setName("Aarav Sharma");
                s1.setEmail("aarav@example.edu");
                s1.setCollege("ABC College");
                s1.setCgpa(8.7);
                s1.setDepartment("Computer Science");
                s1.setSemester(5);
                s1.setTrustScore(78);
                s1.setTrustAcademics(80);
                s1.setTrustRepayments(70);
                s1.setTrustMentorRating(85);
                s1.setSefBalance(12000L);
                s1.setSefWithdrawalLimit(10000L);
                s1.setMentorId("men-101");
                s1.setKycVerified(true);
                s1.setUpdatedAt(Instant.now());

                Student s2 = new Student();
                s2.setId("stu-002");
                s2.setName("Sara Iyer");
                s2.setEmail("sara@example.edu");
                s2.setCollege("ABC College");
                s2.setCgpa(9.1);
                s2.setDepartment("Electronics");
                s2.setSemester(3);
                s2.setTrustScore(88);
                s2.setTrustAcademics(92);
                s2.setTrustRepayments(85);
                s2.setTrustMentorRating(87);
                s2.setSefBalance(8000L);
                s2.setSefWithdrawalLimit(8000L);
                s2.setMentorId("men-101");
                s2.setKycVerified(false);
                s2.setUpdatedAt(Instant.now());

                studentRepository.saveAll(List.of(s1, s2));
            }

            if (loanRepository.count() == 0) {
                Loan l1 = new Loan();
                l1.setId("loan-1001");
                l1.setStudentId("stu-001");
                l1.setAmount(25000L);
                l1.setPurpose("Laptop repair");
                l1.setStatus("pending");
                l1.setMentorApproved(false);
                l1.setInvestorFunded(false);
                l1.setAdminApproved(false);
                l1.setInterestRate(10.5);
                l1.setCollege("ABC College");
                l1.setTrustScore(78);
                l1.setBigLoan(true);
                l1.setCreatedAt(Instant.now());
                l1.setUpdatedAt(Instant.now());

                Loan l2 = new Loan();
                l2.setId("loan-1002");
                l2.setStudentId("stu-002");
                l2.setAmount(15000L);
                l2.setPurpose("Lab course fee");
                l2.setStatus("approved");
                l2.setMentorApproved(true);
                l2.setInvestorFunded(false);
                l2.setAdminApproved(false);
                l2.setInterestRate(9.0);
                l2.setCollege("ABC College");
                l2.setTrustScore(88);
                l2.setBigLoan(false);
                l2.setCreatedAt(Instant.now());
                l2.setUpdatedAt(Instant.now());

                loanRepository.saveAll(List.of(l1, l2));
            }

            if (communityRepository.count() == 0) {
                Community c1 = new Community();
                c1.setId("com-11");
                c1.setName("CS Batch 2023");
                c1.setDescription("Peer micro-funding for CS students");
                c1.setScope("institution");
                c1.setCreatorId("stu-001");
                c1.setMembers(List.of("stu-001"));

                Community c2 = new Community();
                c2.setId("com-22");
                c2.setName("Robotics Club");
                c2.setDescription("Robotics community fund");
                c2.setScope("friends");
                c2.setCreatorId("stu-002");
                c2.setMembers(List.of("stu-001", "stu-002"));

                communityRepository.saveAll(List.of(c1, c2));

                CommunityPost p1 = new CommunityPost();
                p1.setId("poll-1");
                p1.setCommunityId("com-11");
                p1.setType("poll");
                p1.setStudentId("stu-001");
                p1.setAmount(500L);
                p1.setTitle("Need ₹500 for lab fee");
                p1.setVotesFor(8);
                p1.setVotesAgainst(1);
                p1.setStatus("open");

                CommunityPost p2 = new CommunityPost();
                p2.setId("poll-2");
                p2.setCommunityId("com-22");
                p2.setType("poll");
                p2.setStudentId("stu-002");
                p2.setAmount(700L);
                p2.setTitle("Sensor purchase");
                p2.setVotesFor(5);
                p2.setVotesAgainst(2);
                p2.setStatus("funded");

                communityPostRepository.saveAll(List.of(p1, p2));
            }
        };
    }
}
