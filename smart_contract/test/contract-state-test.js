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
    const addStatementTx = await contractState.addStatement(
      "contract_0",
      [{"id": 0, "args": "< 4"}],
      [{"id": 0, "args": "1"}],
      [{"id": 1, "args": "0"}]
    );
    await addStatementTx.wait(); // Wait until transaction is mined.

    // Get contract.
    const getContractTx = await contractState.getContract("contract_0");
    expect(getContractTx.isContract).to.be.true;
    expect(getContractTx.numStatements).to.equal(1);
    expect(getContractTx.statements[0].numConditions).to.equal(1);
    expect(getContractTx.statements[0].numConsequents).to.equal(1);
    expect(getContractTx.statements[0].numAlternatives).to.equal(1);
    expect(getContractTx.statements[0].conditions[0].id).to.equal(0);
    expect(getContractTx.statements[0].conditions[0].args).to.equal("< 4");
    expect(getContractTx.statements[0].alternatives[0].id).to.equal(1);
    expect(getContractTx.statements[0].alternatives[0].args).to.equal("0");
  });
});
