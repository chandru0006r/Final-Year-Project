package com.inter.demo.trusted.repo;

import com.inter.demo.trusted.model.InvestorLoan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestorLoanRepository extends JpaRepository<InvestorLoan, String> {
    List<InvestorLoan> findByStudentId(String studentId);
}
