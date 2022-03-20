const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test contract state", function () {
  let ContractState;
  let contractState;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    ContractState = await ethers.getContractFactory("Linker");

    // A `Signer` in ethers.js is an object that represents an Ethereum account.
    // It's used to send transactions to contracts and other accounts.
    // Here we're getting a list of the accounts in the node we're connected to,
    // which in this case is Hardhat Network.
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    contractState = await ContractState.deploy();
  });

  describe("Create contract", function () {
    it("Should successfully create a contract", async function () {
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

  describe("Pay to contract", function () {
    it("Should pay to a contract and record the payment", async function () {
      // Create new contract.
      const createContractTx = await contractState.newContract("contract_0");
      await createContractTx.wait(); // Wait until transaction is mined.

      // Pay the contract from the `owner` account.
      let overrides = {
        value: ethers.utils.parseEther("1.0") // 1 ETH
      };
      await contractState.connect(owner).payContract("contract_0", overrides);

      // Check the contract's balance recorder the user's payment.
      let balance = await contractState.payerBalance("contract_0", owner.address);
      expect(balance).to.equal("1000000000000000000");
    });
  });
});
