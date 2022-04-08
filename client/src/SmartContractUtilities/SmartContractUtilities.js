import { ethers } from 'ethers'

import ContractExecutor from '../contract_artifacts/contracts/ContractExecutor.sol/ContractExecutor.json'
import ContractState from '../contract_artifacts/contracts/Condition.sol/ConditionExecutor.json'


// Update with the contract address logged out to the CLI when it was deployed 
const smartContractAddress = process.env.REACT_APP_CONTRACT_ACCOUNT;
    

// request access to the user's MetaMask account
async function requestAccount() {
  if (typeof window.ethereum === 'undefined') {
    window.ethereum.enable();
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
}


export async function newContract(contractName) {  
  try {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const cs = new ethers.Contract(smartContractAddress, ContractState.abi, signer);

    const createContractTx = await cs.newContract(contractName);

    await createContractTx.wait(); // Wait for it to be mined
  }
  catch (err) {
    console.log(err);
    return false;
  }

  return true;
}

export async function getContract(contractName) {
  try {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const cs = new ethers.Contract(smartContractAddress, ContractState.abi, signer);

    let res = await cs.getContract(contractName);

    return res
  }
  catch (err) {
    console.log(err);
    return false;
  }
}


export async function addStatement(contractName, conditions, consequents, alternatives) {
  try {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const cs = new ethers.Contract(smartContractAddress, ContractState.abi, signer);

    const addStatementTx = await cs.addStatement(
      contractName,
      conditions,
      consequents,
      alternatives
    );

    await addStatementTx.wait();  // Wait for it to get mined
  }
  catch (err) {
    console.log(err);
    return false;
  }

  return true;
}


export async function userConfirm(contractName) {
  try {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const cs = new ethers.Contract(smartContractAddress, ContractState.abi, signer);

    const userConfirmTx = await cs.userConfirm(contractName);

    await userConfirmTx.wait();  // Wait for it to get mined
  }
  catch (err) {
    console.log(err);
    return false;
  }

  return true;
}


export async function userDeny(contractName) {
  try {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const cs = new ethers.Contract(smartContractAddress, ContractState.abi, signer);

    const userDenyTx = await cs.userDeny(contractName);

    await userDenyTx.wait();  // Wait for it to get mined
  }
  catch (err) {
    console.log(err);
    return false;
  }

  return true;
}


export async function executeContract(contractName) {
  try {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const cx = new ethers.Contract(smartContractAddress, ContractExecutor.abi, signer);

    const executeContractTx = await cx.executeContract(contractName);

    await executeContractTx.wait();  // Wait for it to get mined
  }
  catch (err) {
    console.log(err);
    return false;
  }

  return true;
}


export async function payContract(contractName, value) {
  try {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const cs = new ethers.Contract(smartContractAddress, ContractState.abi, signer);

    const executeContractTx = await cs.payContract(contractName);

    // Pay the contract from the `owner` account.
    const overrides = {
      value: ethers.utils.parseEther(String(value))
    };

    await cs.connect(signer).payContract(contractName, overrides);

    await executeContractTx.wait();  // Wait for it to get mined
  }
  catch (err) {
    console.log(err);
    return false;
  }

  return true;
}