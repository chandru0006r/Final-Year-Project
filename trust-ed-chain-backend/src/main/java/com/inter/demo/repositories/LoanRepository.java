package com.inter.demo.repositories;

import com.inter.demo.entities.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, String> {
    List<Loan> findByStudentId(String studentId);
}
