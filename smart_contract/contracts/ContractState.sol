// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

contract ContractState {
    struct Action {
        uint8 actionType;
        string[] strArgs;
        int256[] intArgs;
        address[] addrArgs;
    }

    // Map conditionType to total length of arguments expected for that condtionType.
    mapping(uint8 => uint8) internal conditionArgNum;

    // Map actionType to total length of arguments expected for that actionType.
    mapping(uint8 => uint8) internal actionArgNum;

    struct Condition {
        uint8 conditionType;
        string[] strArgs;
        int256[] intArgs;
        address[] addrArgs;
	}

    // Use `constructor` function to initialize `conditionArgNum` and `actionArgNum` mapping.
    constructor() {
        conditionArgNum[0] = 2;
        conditionArgNum[1] = 3;
        conditionArgNum[2] = 1;
        conditionArgNum[3] = 1;
        actionArgNum[0] = 1;
        actionArgNum[1] = 2;
        actionArgNum[2] = 1;
        actionArgNum[3] = 0;
        
        // For testing purposes
        actionArgNum[200] = 2;
        actionArgNum[201] = 3;
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
        int8 curStatement;
    }

    // A mapping from contract_name => sender => bool.
    mapping(string => mapping(address => bool)) public userConfirmation;

    // A mapping from contract_name => sender => amount paid.
    mapping(string => mapping(address => uint)) public payerBalance;

    // We can't iterate a mapping in Solidity, so we need this workaround
    mapping(string => address[]) internal contractToAddresses;
    mapping(string => mapping(address => bool)) internal contractToIsAddressExist;

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
            uint totArgLen = consequents[i].strArgs.length + consequents[i].intArgs.length + consequents[i].addrArgs.length;
            require(totArgLen == actionArgNum[consequents[i].actionType], "Incorrect number of args for action");
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
            uint totArgLen = alternatives[i].strArgs.length + alternatives[i].intArgs.length + alternatives[i].addrArgs.length;
            require(totArgLen == actionArgNum[alternatives[i].actionType], "Incorrect number of args for action");
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].actionType = alternatives[i].actionType;
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].strArgs = alternatives[i].strArgs;
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].intArgs = alternatives[i].intArgs;
            contractStructs[contractName].statements[statementIndex].alternatives[alternativesIndex].addrArgs = alternatives[i].addrArgs;
            contractStructs[contractName].statements[statementIndex].numAlternatives++;
        }

        contractStructs[contractName].numStatements++;
        
        return true;
    }

    function userConfirm(string calldata contractName) external {
        require(isContract(contractName), "Contract does not exit");

        require(userConfirmation[contractName][msg.sender] == false, "User already confirmed");
        userConfirmation[contractName][msg.sender] = true;
    }

    function userDeny(string calldata contractName) external {
        require(isContract(contractName), "Contract does not exit");

        require(userConfirmation[contractName][msg.sender] == true, "User has not confirmed yet");
        userConfirmation[contractName][msg.sender] = false;
    }

    function payContract(string calldata contractName) external payable {
        // Assert contract exists.
        require(isContract(contractName), "Contract does not exist");
        Contract storage contractToPay = contractStructs[contractName];

        contractToPay.balance += msg.value;

        if (contractToIsAddressExist[contractName][msg.sender] == false) {
            contractToAddresses[contractName].push(msg.sender);
            contractToIsAddressExist[contractName][msg.sender] = true;
        }
        payerBalance[contractName][msg.sender] += msg.value;
    }
}
