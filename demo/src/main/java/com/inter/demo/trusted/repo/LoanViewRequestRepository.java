package com.inter.demo.trusted.repo;

import com.inter.demo.trusted.model.LoanViewRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanViewRequestRepository extends JpaRepository<LoanViewRequest, Long> {
    List<LoanViewRequest> findByLoanId(String loanId);
}
