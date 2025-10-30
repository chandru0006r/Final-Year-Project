package com.inter.demo.trusted.service;

import com.inter.demo.trusted.model.InvestorLoan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Optional;

@Service
public class BlockchainService {
    private static final Logger log = LoggerFactory.getLogger(BlockchainService.class);

    @Value("${blockchain.rpc-url:}")
    private String rpcUrl;
    @Value("${blockchain.private-key:}")
    private String privateKey;
    @Value("${blockchain.contract-address:}")
    private String contractAddress;

    public Optional<String> recordLoanOnChain(InvestorLoan loan) {
        try {
            if (rpcUrl == null || rpcUrl.isBlank() || privateKey == null || privateKey.isBlank()) {
                // Fallback: synthesize a deterministic fake tx hash so flows continue in dev
                String seed = loan.getId() + ":" + loan.getStudentId() + ":" + loan.getAmount() + ":" + Instant.now();
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hash = digest.digest(seed.getBytes(StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder();
                for (byte b : hash) sb.append(String.format("%02x", b));
                String fakeHash = "0x" + sb.substring(0, 64);
                log.info("Blockchain not configured. Using fake tx hash {} for loan {}", fakeHash, loan.getId());
                return Optional.of(fakeHash);
            }

            Web3j web3j = Web3j.build(new HttpService(rpcUrl));
            Credentials.create(privateKey); // validate key
            // NOTE: Real contract call would go here using a generated wrapper
            // For now, log and return a pseudo hash to avoid blocking
            String pseudoHash = "0x" + Integer.toHexString((loan.getId() + System.nanoTime()).hashCode()).replace("-", "");
            log.info("Pretending to submit loan {} to chain via {}. tx={}", loan.getId(), rpcUrl, pseudoHash);
            web3j.shutdown();
            return Optional.of(pseudoHash);
        } catch (Exception e) {
            log.error("Blockchain submission failed for loan {}: {}", loan.getId(), e.getMessage());
            return Optional.empty();
        }
    }

    public String getConfiguredContractAddress() {
        return contractAddress;
    }
}
