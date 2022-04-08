// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./ContractState.sol";
import "./Utilities.sol";
import "hardhat/console.sol";

contract ConditionExecutor is ContractState, Utilities {
    function judgeAllConditions(string calldata contractName) internal view returns(bool) {
        Contract storage ct = contractStructs[contractName];
        Statement storage st = ct.statements[uint256(int(ct.curStatement))];
        
        for (uint i = 0; i < st.numConditions; i++) {
            if (!judgeCondition(contractName, st.conditions[i])) {
                return false;
            }
        }

        return true;
    }
    
    function judgeCondition(string calldata contractName, Condition storage condition) private view returns(bool) {
        if (condition.conditionType == 0) {
            return judgeContractBalance(contractName, condition);
        } else if (condition.conditionType == 1) {
            return judgeUserBalance(contractName, condition);
        } else if (condition.conditionType == 2) {
            return judgeUserConfirmation(contractName, condition);
        } else if (condition.conditionType == 3) {
            return judgeBeforeDateTime(condition);
        } else {
            // We really shouldn't reach here.
            return false;
        }
    }

    function judgeBeforeDateTime(Condition storage condition) private view returns(bool) {
        // NB: cast to `uint256` may cause panics when the arg is negative.
        uint256 dateTime = uint256(condition.intArgs[0]); // as seconds after Unix epoch.

        return block.timestamp < dateTime;
    }

    function judgeUserConfirmation(string calldata contractName, Condition storage condition) private view returns(bool) {
        address userAddress = condition.addrArgs[0];

        return userConfirmation[contractName][userAddress];
    }

    function judgeContractBalance(string calldata contractName, Condition storage condition) private view returns(bool) {
        bytes32 inequality = keccak256(bytes(condition.strArgs[0]));
        uint256 threshold = uint256(condition.intArgs[0]) * 1 ether;

        if (inequality == lessThan) {
            return contractStructs[contractName].balance < threshold;
        } else if (inequality == lessThanOrEqualTo) {
            return contractStructs[contractName].balance <= threshold;
        } else if (inequality == greaterThan) {
            return contractStructs[contractName].balance > threshold;
        } else {
            require(inequality == greaterThanOrEqualTo, "Invalid argument in condition");
            return contractStructs[contractName].balance >= threshold;
        }
    }

    function judgeUserBalance(string calldata contractName, Condition storage condition) private view returns(bool) {
        address userAddress = condition.addrArgs[0];
        uint256 userBalance = payerBalance[contractName][userAddress];
        bytes32 inequality = keccak256(bytes(condition.strArgs[0]));
        uint256 threshold = uint256(condition.intArgs[0]) * 1 ether;

        if (inequality == lessThan) {
            return userBalance < threshold;
        } else if (inequality == lessThanOrEqualTo) {
            return userBalance <= threshold;
        } else if (inequality == greaterThan) {
            return userBalance > threshold;
        } else {
            require(inequality == greaterThanOrEqualTo, "Invalid argument in condition");
            return userBalance >= threshold;
        }
    }
}
