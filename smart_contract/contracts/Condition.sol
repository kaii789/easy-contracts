// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./ContractState.sol";
import "./Utilities.sol";

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
        } else {
            // We really shouldn't reach here.
            return false;
        }
    }

    function judgeContractBalance(string calldata contractName, Condition storage condition) private view returns(bool) {
        bytes32 inequality = keccak256(bytes(condition.strArgs[0]));

        if (inequality == lessThan) {
            return contractStructs[contractName].balance < condition.intArgs[0];
        } else if (inequality == lessThanOrEqualTo) {
            return contractStructs[contractName].balance <= condition.intArgs[0];
        } else if (inequality == greaterThan) {
            return contractStructs[contractName].balance > condition.intArgs[0];
        } else {
            require(inequality == greaterThanOrEqualTo, "Invalid argument in condition");
            return contractStructs[contractName].balance >= condition.intArgs[0];
        }
    }

    function judgeUserBalance(string calldata contractName, Condition storage condition) private view returns(bool) {
        address userAddress = condition.addrArgs[0];
        uint256 userBalance = payerBalance[contractName][userAddress];
        bytes32 inequality = keccak256(bytes(condition.strArgs[0]));

        if (inequality == lessThan) {
            return userBalance < condition.intArgs[0];
        } else if (inequality == lessThanOrEqualTo) {
            return userBalance <= condition.intArgs[0];
        } else if (inequality == greaterThan) {
            return userBalance > condition.intArgs[0];
        } else {
            require(inequality == greaterThanOrEqualTo, "Invalid argument in condition");
            return userBalance >= condition.intArgs[0];
        }
    }
}
