// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

contract ContractState {
    struct Action {
        uint8 id;
        string[] args;
    }

    struct Condition {
        uint8 id;
        string[] args;
	}

    struct Statement {
        Condition[10] conditions;
        Action[10] consequents;
        Action[10] alternatives;
        uint8 numConditions;
        uint8 numConsequents;
        uint8 numAlternatives;
    }

    struct Contract {
        bool isContract;
        uint256 balance;
        Statement[10] statements;
        uint8 numStatements;
        uint8 curStatement;
    }

    // A mapping from contract_name => sender => amount paid.
    mapping(string => mapping(address => uint)) public payerBalance;

    // A mapping to `Contract` structs.
    mapping(string => Contract) private contractStructs;

    function isContract(string calldata name) private view returns(bool) {
        return contractStructs[name].isContract;
    }

    function newContract(string calldata name) external returns(bool success) {
        require(!isContract(name), "Contract with name already exists"); // Make sure contract with name doesn't already exist.
        contractStructs[name].isContract = true;
        return true;
    }

    function getContract(string calldata name) external view returns(Contract memory) {
        // Assert contract exists.
        require(isContract(name), "Contract does not exist");
        return contractStructs[name];
    }

    function addStatement(string calldata contractName,
                          Condition[] memory conditions,
                          Action[] memory consequents,
                          Action[] memory alternatives) external returns(bool success) {
        // Assert contract exists.
        require(isContract(contractName), "Contract does not exist");

        uint8 statementIndex = contractStructs[contractName].numStatements;
        require(statementIndex < 10, "Too many statements");

        // Add conditions. 
        for (uint i = 0; i < conditions.length; i++) {
            uint8 conditionIndex = contractStructs[contractName].statements[statementIndex].numConditions;
            require(conditionIndex < 10, "Too many conditions");
            contractStructs[contractName].statements[statementIndex].conditions[conditionIndex].id = conditions[i].id;
            contractStructs[contractName].statements[statementIndex].conditions[conditionIndex].args = conditions[i].args;
            contractStructs[contractName].statements[statementIndex].numConditions++;
        }
        // Add consequents.
        for (uint i = 0; i < consequents.length; i++) {
            uint8 consequentIndex = contractStructs[contractName].statements[statementIndex].numConsequents;
            require(consequentIndex < 10, "Too many consequents");
            contractStructs[contractName].statements[statementIndex].consequents[consequentIndex].id = consequents[i].id;
            contractStructs[contractName].statements[statementIndex].consequents[consequentIndex].args = consequents[i].args;
            contractStructs[contractName].statements[statementIndex].numConsequents++;
        }
        // Add alternatives.
        for (uint i = 0; i < alternatives.length; i++) {
            uint8 alternativesIndex = contractStructs[contractName].statements[statementIndex].numAlternatives;
            require(alternativesIndex < 10, "Too many alternatives");
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].id = alternatives[i].id;
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].args = alternatives[i].args;
            contractStructs[contractName].statements[statementIndex].numAlternatives++;
        }

        contractStructs[contractName].numStatements++;
        
        return true;
    }

    function payContract(string calldata contractName) external payable {
        // Assert contract exists.
        require(isContract(contractName), "Contract does not exist");
        Contract storage contractToPay = contractStructs[contractName];

        contractToPay.balance += msg.value;
        payerBalance[contractName][msg.sender] += msg.value;
    }
}
