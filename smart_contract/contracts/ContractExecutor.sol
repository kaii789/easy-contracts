// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./Condition.sol";
import "./ContractState.sol";
// import "./Utilities.sol";

contract ContractExecutor is ContractState, ConditionExecutor {
    function executeContract(string calldata contractName) public {
        // This will be called by the client
        
        Contract storage ct = contractStructs[contractName];
        ct.curStatement = executeStatement(contractName);

        if (ct.curStatement == -1) {
            // TODO: End contract
        }
    }

    function executeStatement(string calldata contractName) private returns(int8) {
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
            
            // TODO: Add support for more action types
            if (atype == 0) {
                int8 nextStatementID = int8(int(action.intArgs[0]));
                return nextStatementID;
            } else {
                // Something's wrong!
            }
        }

        return -1; // No jump, so contract is done
    }
}
