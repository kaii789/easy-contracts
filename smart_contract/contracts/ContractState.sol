// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

contract ContractState {
    struct Action {
        uint8 actionType;
        string[] strArgs;
        uint256[] intArgs;
        address[] addrArgs;
    }

    // Map conditionType to total length of arguments expected for that condtionType.
    mapping(uint8 => uint8) internal conditionArgNum;

    struct Condition {
        uint8 conditionType;
        string[] strArgs;
        uint256[] intArgs;
        address[] addrArgs;
	}

    // Use `constructor` function to initialize `conditionArgNum` mapping.
    constructor() {
        conditionArgNum[0] = 2;
        conditionArgNum[1] = 3;
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
    mapping(string => Contract) internal contractStructs;

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
            uint totArgLen = conditions[i].strArgs.length + conditions[i].intArgs.length + conditions[i].addrArgs.length;
            require(totArgLen == conditionArgNum[conditions[i].conditionType], "Incorrect number of args for condition");
            contractStructs[contractName].statements[statementIndex].conditions[conditionIndex].conditionType = conditions[i].conditionType;
            contractStructs[contractName].statements[statementIndex].conditions[conditionIndex].strArgs = conditions[i].strArgs;
            contractStructs[contractName].statements[statementIndex].conditions[conditionIndex].intArgs = conditions[i].intArgs;
            contractStructs[contractName].statements[statementIndex].conditions[conditionIndex].addrArgs = conditions[i].addrArgs;
            contractStructs[contractName].statements[statementIndex].numConditions++;
        }
        // Add consequents.
        for (uint i = 0; i < consequents.length; i++) {
            uint8 consequentIndex = contractStructs[contractName].statements[statementIndex].numConsequents;
            require(consequentIndex < 10, "Too many consequents");
            contractStructs[contractName].statements[statementIndex].consequents[consequentIndex].actionType = consequents[i].actionType;
            contractStructs[contractName].statements[statementIndex].consequents[consequentIndex].strArgs = consequents[i].strArgs;
            contractStructs[contractName].statements[statementIndex].consequents[consequentIndex].intArgs = consequents[i].intArgs;
            contractStructs[contractName].statements[statementIndex].consequents[consequentIndex].addrArgs = consequents[i].addrArgs;
            contractStructs[contractName].statements[statementIndex].numConsequents++;
        }
        // Add alternatives.
        for (uint i = 0; i < alternatives.length; i++) {
            uint8 alternativesIndex = contractStructs[contractName].statements[statementIndex].numAlternatives;
            require(alternativesIndex < 10, "Too many alternatives");
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].actionType = alternatives[i].actionType;
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].strArgs = alternatives[i].strArgs;
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].intArgs = alternatives[i].intArgs;
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].addrArgs = alternatives[i].addrArgs;
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
