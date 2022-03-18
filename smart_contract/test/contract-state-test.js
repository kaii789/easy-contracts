const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Create contract", function () {
  it("Should successfully create a contract", async function () {
    // Deploy Contract.
    const ContractState = await ethers.getContractFactory("ContractState");
    const contractState = await ContractState.deploy();
    await contractState.deployed();

    // Create new contract.
    const createContractTx = await contractState.newContract("contract_0");
    await createContractTx.wait(); // Wait until transaction is mined.

    // Create a contract with the same name (should fail).
    await expect(contractState.newContract("contract_0")).to.be.revertedWith('Contract with name already exists');

    // Get contract.
    const getContractTx = await contractState.getContract("contract_0");
    expect(getContractTx.isContract).to.be.true;
    expect(getContractTx.numStatements).to.equal(0);
  });
});

describe("Add statement", function () {
  it("Should successfully add statements to a contract", async function () {
    // Deploy Contract.
    const ContractState = await ethers.getContractFactory("ContractState");
    const contractState = await ContractState.deploy();
    await contractState.deployed();

    // Create new contract.
    const createContractTx = await contractState.newContract("contract_0");
    await createContractTx.wait(); // Wait until transaction is mined.

    // Add statements.
    const addStatementTx1 = await contractState.addStatement(
      "contract_0",
      [{"id": 0, "args": ["<", "4"]}],
      [{"id": 0, "args": ["1"]}],
      [{"id": 1, "args": ["user1"]}]
    );
    await addStatementTx1.wait(); // Wait until transaction is mined.
    const addStatementTx2 = await contractState.addStatement(
      "contract_0",
      [{"id": 0, "args": [">=", "324"]}],
      [{"id": 2, "args": ["bar"]}],
      [{"id": 3, "args": ["foo"]}, {"id": 4, "args": ["baz", "moo"]}]
    );
    await addStatementTx2.wait(); // Wait until transaction is mined.
    
    // Get contract.
    const getContractTx = await contractState.getContract("contract_0");
    expect(getContractTx.isContract).to.be.true;
    expect(getContractTx.numStatements).to.equal(2);
    expect(getContractTx.statements[0].numConditions).to.equal(1);
    expect(getContractTx.statements[0].numConsequents).to.equal(1);
    expect(getContractTx.statements[0].numAlternatives).to.equal(1);
    expect(getContractTx.statements[0].conditions[0].id).to.equal(0);
    // `.eql()`: deep compare xref: https://github.com/chaijs/deep-eql
    expect(getContractTx.statements[0].conditions[0].args).to.eql(['<', '4']);
    expect(getContractTx.statements[0].alternatives[0].id).to.eql(1);
    expect(getContractTx.statements[0].alternatives[0].args).to.eql(['user1']);
    expect(getContractTx.statements[1].alternatives[1].args).to.eql(['baz', 'moo']);
  });
});
