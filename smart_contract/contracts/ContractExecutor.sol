// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./Condition.sol";
import "./ContractState.sol";
import "hardhat/console.sol";

contract ContractExecutor is ContractState, ConditionExecutor {
    function executeContract(string calldata contractName) public {
        // This will be called by the client
        
        Contract storage ct = contractStructs[contractName];
        require(ct.curStatement != -1);

        executeStatement(contractName);
        if (ct.curStatement == -1) {
            // TODO: End contract
        }
    }

    function executeStatement(string calldata contractName) private{
        Contract storage ct = contractStructs[contractName];
        Statement storage st = ct.statements[uint256(int(ct.curStatement))];
        
        uint8 numActions;
        Action[10] storage actions;
        if (judgeAllConditions(contractName)) {
            numActions = st.numConsequents;
            actions = st.consequents;
        } else {
            numActions = st.numAlternatives;
            actions = st.alternatives;
        }
        
        Action storage action;
        uint8 atype;
        for (uint i = 0; i < numActions; i++) {
            action = actions[i];
            atype = action.actionType;
            
            if (atype == 0) {
                // Jump
                ct.curStatement = int8(int(action.intArgs[0]));
            } else if (atype == 1) {
                address to = action.addrArgs[0];
                uint256 amount = uint256(action.intArgs[0]);
                payUser(contractName, to, amount);
            } else if (atype == 2) {
                address to = action.addrArgs[0];
                payUserEntireBalance(contractName, to);
            } else if (atype == 3) {
                refundAll(contractName);
            }
        }
    }

    function payUser(string calldata contractName, address to, uint256 amount) private {
        uint256 wei_amount = amount * 1 ether;
        
        Contract storage ct = contractStructs[contractName];
        require(ct.balance >= wei_amount);
        
        address payable receiver = payable(to);
        receiver.transfer(wei_amount);
        ct.balance -= wei_amount;
    }

    function payUserEntireBalance(string calldata contractName, address to) private {
        Contract storage ct = contractStructs[contractName];
        address payable receiver = payable(to);
        receiver.transfer(ct.balance);
        ct.balance = 0;
    }

    function refundAll(string calldata contractName) private {
        Contract storage ct = contractStructs[contractName];
        uint numAddresses = contractToAddresses[contractName].length;

        uint256 refundAmount = 0;
        for (uint i = 0; i < numAddresses; i++) {
            address to = contractToAddresses[contractName][i];
            refundAmount += payerBalance[contractName][to];
        }

        require(ct.balance >= refundAmount);
        
        for (uint i = 0; i < numAddresses; i++) {
            address to = contractToAddresses[contractName][i];
            uint256 amount = payerBalance[contractName][to];
            payerBalance[contractName][to] = 0;
            address payable receiver = payable(contractToAddresses[contractName][i]);
            receiver.transfer(amount);
            ct.balance -= amount;
        }
        // console.log(ct.balance); 
    }
}
