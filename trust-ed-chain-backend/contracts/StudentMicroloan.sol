// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentMicroloan {
    enum LoanAction { Created, Funded, Repaid, StatusUpdated, Penalty, Forgiveness }

    struct LoanEvent {
        uint256 loanId;
        LoanAction action;
        uint256 amount;
        string status; // optional status info
        uint256 timestamp;
    }

    mapping(uint256 => LoanEvent[]) public loanHistory;

    event LoanLogged(uint256 loanId, LoanAction action, uint256 amount, string status);

    function logLoan(
        uint256 loanId,
        LoanAction action,
        uint256 amount,
        string memory status
    ) external {
        LoanEvent memory newEvent = LoanEvent({
            loanId: loanId,
            action: action,
            amount: amount,
            status: status,
            timestamp: block.timestamp
        });

        loanHistory[loanId].push(newEvent);
        emit LoanLogged(loanId, action, amount, status);
    }

    function getLoanEvents(uint256 loanId) external view returns (LoanEvent[] memory) {
        return loanHistory[loanId];
    }
}
