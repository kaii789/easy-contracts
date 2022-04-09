import { ethers } from 'ethers'

import ContractExecutor from '../contract_artifacts/contracts/ContractExecutor.sol/ContractExecutor.json'
import ContractState from '../contract_artifacts/contracts/Condition.sol/ConditionExecutor.json'


// Update with the contract address logged out to the CLI when it was deployed 
const smartContractAddress = process.env.REACT_APP_CONTRACT_ACCOUNT;
    

// Get contract instance based on abi.
async function getContractAbi(abi) {
  if (typeof window.ethereum === 'undefined') {
    window.ethereum.enable();
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const cs = new ethers.Contract(smartContractAddress, abi, signer);
  return cs
}


export async function newContract(contractName) {  
  try {
    const cs = await getContractAbi(ContractState.abi);

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
    const cs = await getContractAbi(ContractState.abi);

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
    const cs = await getContractAbi(ContractState.abi);

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
    const cs = await getContractAbi(ContractState.abi);

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
    const cs = await getContractAbi(ContractState.abi);

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
    const cs = await getContractAbi(ContractExecutor.abi);

    const executeContractTx = await cs.executeContract(contractName);

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
    const cs = await getContractAbi(ContractState.abi);

    const executeContractTx = await cs.payContract(contractName);

    // Pay the contract from the `owner` account.
    const overrides = {
      value: ethers.utils.parseEther(String(value))
    };

    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

    await cs.connect(signer).payContract(contractName, overrides);

    await executeContractTx.wait();  // Wait for it to get mined
  }
  catch (err) {
    console.log(err);
    return false;
  }

  return true;
}
