const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Test full contracts for real scenarios", function () {
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
  
      // To deploy our contract, we just have to call ContractState.deploy() and await
      // for it to be deployed(), which happens once its transaction has been
      // mined.
      contractState = await ContractState.deploy();
    });

    describe("Test marketplace reseller example", function () {
      it("Should emulate a sample contract created to facilitate a safe remote purchase", async function () {
        /*
        https://jacksonng.org/Safe-Remote-Purchase-1

        Background:
        Alice is looking to buy an item" on the resell market. She has found "SneakerHE4D420" who is offering to sell this item for 10 ETH.

        Contract overview:
        Essentially behaves as an escrow account for this transaction. 
        She can write some simple logic in her contract (recall that the sneakers are being sold for 10 ETH):
        1. Alice must deposit 20 (2 x price) into the smart contract.
        2. "SneakerHE4D420" must deposit 20 (2 x price) into the smart contract.
        3. 10 (1 x price) of the funds in the smart contract will be sent to Alice, 
           and 30 (3 x price) of the funds in the smart will be sent to "SneakerHE4D420" ONLY IF Alice confirms receipt
           of the sneakers and the sneakers are to her satisfaction.
        
        # Statement 0
        ## If
        - Alice (addr1) deposits 20
        - SneakerHE4D420 (addr2) deposits 20
        ## Then
        1. jump to Statement 1
        ## Else
        1. pay account balance to original owners

        ## Statement 1
        ## If
        - Alice confirms
        ## Then
        1. pay 30 to SneakerHE4D420 (addr2)
        2. pay 10 to Alice (addr1)
        3. END CONTRACT
        ## Else
        do nothing
        */

        // Create new contract.
        const createContractTx = await contractState.newContract("contract_0");
        await createContractTx.wait(); // Wait until transaction is mined.
  
        // Add statements.
        const addStatementTx1 = await contractState.addStatement(
          "contract_0",
          [{"conditionType": 1, "strArgs": [">="], "intArgs": [20], "addrArgs": [addr1.address]},
           {"conditionType": 1, "strArgs": [">="], "intArgs": [20], "addrArgs": [addr2.address]}],
          [{"actionType": 0, "strArgs": [], "intArgs": [1], "addrArgs": []}],
          [{"actionType": 3, "strArgs": [], "intArgs": [], "addrArgs": []}]
        );
        await addStatementTx1.wait(); // Wait until transaction is mined.
        const addStatementTx2 = await contractState.addStatement(
          "contract_0",
          [{"conditionType": 2, "strArgs": [], "intArgs": [], "addrArgs": [addr1.address]}],
          [{"actionType": 1, "strArgs": [], "intArgs": [10], "addrArgs": [addr1.address]},
           {"actionType": 1, "strArgs": [], "intArgs": [30], "addrArgs": [addr2.address]},
           {"actionType": 0, "strArgs": [], "intArgs": [-1], "addrArgs": []}],
          []
        );
        await addStatementTx2.wait(); // Wait until transaction is mined.
        
        // const beforeBalance1 = await waffle.provider.getBalance(addr1.address);

        // Alice and SneakerHE4D420 each add 20 ETH.
        let overrides = {
            value: ethers.utils.parseEther("20.0")
        };

        await contractState.connect(addr1).payContract("contract_0", overrides);
        await contractState.connect(addr2).payContract("contract_0", overrides);

        // Execute Contract: Should jump to statement 1
        const executeContractTx1 = await contractState.executeContract(
            "contract_0"
        );
        await executeContractTx1.wait(); // Wait until transaction is mined.

        // Alice confirms.
        await contractState.connect(addr1).userConfirm("contract_0");
        
        // Alice denies after looking more carefully.
        await contractState.connect(addr1).userDeny("contract_0");

        // Execute Contract: Should do nothing.
        const executeContractTx2 = await contractState.executeContract(
            "contract_0"
        );
        await executeContractTx2.wait(); // Wait until transaction is mined.

        // Alice is finally convinced to confirm.
        await contractState.connect(addr1).userConfirm("contract_0");

        // Execute Contract: Should end.
        const executeContractTx3 = await contractState.executeContract(
            "contract_0"
        );
        await executeContractTx3.wait(); // Wait until transaction is mined.
        // Check contract ended.
        const getContractTx = await contractState.getContract("contract_0");
        expect(getContractTx.isContract).to.be.true;
        expect(getContractTx.curStatement).to.equal(-1);
        
        // const afterBalance1 = await waffle.provider.getBalance(addr1.address);
        // expect(beforeBalance1).to.equal(afterBalance1);

      });
    });
  });
