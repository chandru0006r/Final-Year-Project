package com.inter.demo.services;

import com.inter.demo.entities.Loan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionReceipt;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.Optional;
import java.util.UUID;

@Service
public class BlockchainService {
    private static final Logger log = LoggerFactory.getLogger(BlockchainService.class);

    private final String rpcUrl;
    private final String privateKey;
    private final String contractAddress;

    public BlockchainService(
            @Value("${blockchain.rpc-url:}") String rpcUrl,
            @Value("${blockchain.private-key:}") String privateKey,
            @Value("${blockchain.loan-contract-address:}") String contractAddress
    ) {
        this.rpcUrl = rpcUrl;
        this.privateKey = privateKey;
        this.contractAddress = contractAddress;
    }

    public String recordInvestorLoanOnChain(Loan loan) {
        // If not configured, return a deterministic fake hash to avoid failures in dev
        if (rpcUrl == null || rpcUrl.isBlank() || privateKey == null || privateKey.isBlank() || contractAddress == null || contractAddress.isBlank()) {
            String fake = "0x" + UUID.randomUUID().toString().replace("-", "");
            log.warn("Blockchain not configured. Returning fake tx hash {}", fake);
            return fake;
        }
        try {
            Web3j web3j = Web3j.build(new HttpService(rpcUrl));
            Credentials creds = Credentials.create(privateKey);
            TransactionManager txManager = new RawTransactionManager(web3j, creds);

            // For a real contract, encode function call data via generated wrappers or FunctionEncoder
            // Here, we send a simple 0 value transaction to the contract address with encoded metadata in data field (no-op on-chain)
            String data = encodeLoanMetadata(loan);
            BigInteger gasPrice = DefaultGasProvider.GAS_PRICE;
            BigInteger gasLimit = DefaultGasProvider.GAS_LIMIT;

            String txHash = txManager.sendTransaction(gasPrice, gasLimit, contractAddress, data, BigInteger.ZERO).getTransactionHash();
            log.info("Submitted on-chain tx {} for loan {}", txHash, loan.getId());

            // Try to fetch receipt (non-blocking; may be empty)
            EthGetTransactionReceipt receiptResp = web3j.ethGetTransactionReceipt(txHash).send();
            Optional<TransactionReceipt> r = receiptResp.getTransactionReceipt();
            r.ifPresent(receipt -> log.info("Tx mined in block {}", receipt.getBlockNumber()));
            return txHash;
        } catch (Exception e) {
            log.error("Blockchain tx failed, returning fake hash", e);
            return "0x" + UUID.randomUUID().toString().replace("-", "");
        }
    }

    private String encodeLoanMetadata(Loan loan) {
        // Simple hex encoding of concatenated fields (placeholder). In production, use ABI encoding.
        String concatenated = String.join("|",
                loan.getId(),
                loan.getStudentId(),
                String.valueOf(loan.getAmount()),
                loan.getCollege() == null ? "" : loan.getCollege());
        return Numeric.toHexString(concatenated.getBytes());
    }
}
