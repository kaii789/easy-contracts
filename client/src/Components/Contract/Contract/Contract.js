import React from "react";
import "./Contract.css";
import ContractTile from "../ContractTile/ContractTile.js";

import { newContract, addStatement, userConfirm, userDeny, executeContract, getContract, payContract } from '../../../SmartContractUtilities/SmartContractUtilities.js'


const blank_statement = {
  conditions: [{selected_option: null, strArgs: null, intArgs: null, addrArgs: null}],
  consequents: [{selected_option: null, strArgs: null, intArgs: null, addrArgs: null}],
  alternatives: [{selected_option: null, strArgs: null, intArgs: null, addrArgs: null}],
};


class Contract extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Start new contract with a "root" statement
      newContract: this.props.newContract,
      statements: {
        // Need to do it this way to make sure this is a deep copy of the template
        0: JSON.parse(JSON.stringify(blank_statement))
      },
      currId: 1,
      contractName: "",
      payContractValue: 0,
    }

    this.getCurrId = this.getCurrId.bind(this);
    this.updateStatement = this.updateStatement.bind(this);
    this.postContract = this.postContract.bind(this);
    this.progressContract = this.progressContract.bind(this);
  };


  getCurrId() {
    let currId = this.state.currId;

    this.setState({currId: this.state.currId+1});

    return currId;
  }


  updateStatement(id, update, jump=false) {
    // Copy
    let new_statements = {...this.state.statements};

    // Update
    new_statements[id] = update;

    if (jump) {
      // Need to do it this way to make sure this is a deep copy of the template
      new_statements[jump] = JSON.parse(JSON.stringify(blank_statement));
    }

    // Set
    this.setState({statements: new_statements});
  }


  // Upload this contract as a blockchain smart contract
  async postContract() {
    // Disable all edits
    this.setState({newContract: false});

    let success = true;

    try {
      const contractName = this.state.contractName;

      success &= await newContract(contractName);

      let num_statements_added = 0;
      let queue = [this.state.statements[0]];  // Start with root statement

      // BFS
      while (queue.length > 0) {
        const curr_statement = queue.shift();

        let conditions = []

        for (let j = 0; j < curr_statement.conditions.length; j++) {
          if (Object.keys(curr_statement.conditions[j]).length === 0  || !curr_statement.conditions[j].selected_option) {
            break;
          }

          let str_args = []
          if (curr_statement.conditions[j].strArgs !== null && curr_statement.conditions[j].strArgs !== undefined) {
              str_args = curr_statement.conditions[j].strArgs.split(",").map(e => {
                return e.trim();
              });
          }

          let int_args = []
          if (curr_statement.conditions[j].intArgs !== null && curr_statement.conditions[j].intArgs !== undefined) {
              int_args = curr_statement.conditions[j].intArgs.split(",").map(e => {
                return parseInt(e.trim());
              });
          }

          let addr_args = []
          if (curr_statement.conditions[j].addrArgs !== null && curr_statement.conditions[j].addrArgs !== undefined) {
              addr_args = curr_statement.conditions[j].addrArgs.split(",").map(e => {
                return e.trim().toLowerCase();
              });
          }

          conditions.push({
            "conditionType": parseInt(curr_statement.conditions[j].selected_option.value), 
            "strArgs": str_args,
            "intArgs": int_args,
            "addrArgs": addr_args
          });
        }

        let consequents = []

        for (let j = 0; j < curr_statement.consequents.length; j++) {
          if (Object.keys(curr_statement.consequents[j]).length === 0  || !curr_statement.consequents[j].selected_option) {
            break;
          }

          let actionType = parseInt(curr_statement.consequents[j].selected_option.value);

          let str_args = []
          if (curr_statement.consequents[j].strArgs !== null && curr_statement.consequents[j].strArgs !== undefined) {
              str_args = curr_statement.consequents[j].strArgs.split(",").map(e => {
                return e.trim();
              });
          }

          let int_args = []
          if (curr_statement.consequents[j].intArgs !== null && curr_statement.consequents[j].intArgs !== undefined) {
              int_args = curr_statement.consequents[j].intArgs.split(",").map(e => {
                return parseInt(e.trim());
              });
          }

          let addr_args = []
          if (curr_statement.consequents[j].addrArgs !== null  && curr_statement.consequents[j].addrArgs !== undefined) {
              addr_args = curr_statement.consequents[j].addrArgs.split(",").map(e => {
                return e.trim().toLowerCase();
              });
          }

          // If jump, make sure we're jumping to the correct statement number
          // This workaround can be circumvented by adding an id field for statements on 
          // the smart contract side of thing
          if (actionType === 0) {
            let next_cons_statement = int_args[0];
            queue.push(this.state.statements[next_cons_statement]);
            int_args[0] = ++num_statements_added;
          }

          consequents.push({
            "actionType": actionType, 
            "strArgs": str_args,
            "intArgs": int_args,
            "addrArgs": addr_args
          });
        }

        let alternatives = []

        for (let j = 0; j < curr_statement.alternatives.length; j++) {
          if (Object.keys(curr_statement.alternatives[j]).length === 0 || !curr_statement.alternatives[j].selected_option) {
            break;
          }

          let actionType = parseInt(curr_statement.alternatives[j].selected_option.value);

          let str_args = []
          if (curr_statement.alternatives[j].strArgs !== null  && curr_statement.alternatives[j].strArgs !== undefined) {
              str_args = curr_statement.alternatives[j].strArgs.split(",").map(e => {
                return e.trim();
              });
          }

          let int_args = []
          if (curr_statement.alternatives[j].intArgs !== null && curr_statement.alternatives[j].intArgs !== undefined) {
              int_args = curr_statement.alternatives[j].intArgs.split(",").map(e => {
                return parseInt(e.trim());
              });
          }

          let addr_args = []
          if (curr_statement.alternatives[j].addrArgs !== null && curr_statement.alternatives[j].addrArgs !== undefined) {
              addr_args = curr_statement.alternatives[j].addrArgs.split(",").map(e => {
                return e.trim().toLowerCase();
              });
          }

          // If jump, make sure we're jumping to the correct statement number
          // This workaround can be circumvented by adding an id field for statements on 
          // the smart contract side of thing
          if (actionType === 0) {
            let next_alt_statement = int_args[0];
            queue.push(this.state.statements[next_alt_statement]);
            int_args[0] = ++num_statements_added;
          }

          alternatives.push({
            "actionType": actionType, 
            "strArgs": str_args,
            "intArgs": int_args,
            "addrArgs": addr_args
          });
        }

        success &= await addStatement(contractName, conditions, consequents, alternatives);
      }
    }
    catch (err) {
      success = false;
      console.log(err);

      // Enable edits again since we weren't able to upload this contract, edits may be needed
      this.setState({newContract: true});
    }

    if (!success) {
      alert("Contract creation unsuccessful. Please make sure your entered all inputs correctly and chose a unique contract name. If using a test account with Metamask, make sure to reset the account. :)");
      return;
    }

    alert("Contract " + this.state.contractName + " created successfully!");

    this.printContract(this.state.contractName);
  }


  async progressContract() {
    await executeContract(this.state.contractName);
  }


  async printContract(contractName) {
    const contract = await getContract(contractName);
    console.log(contract);
  }


  async payContract(contractName) {
    await payContract(contractName, this.state.payContractValue);
  }


  render() {
    return (
      <div className="Contract">
        {/* Disables edits to current displayed contract */}
        <div style={this.state.newContract ? {} : {pointerEvents: "none"}}>
          {/* We're passing the entire collection of statements down to this "root" tile to do a recursive rendering */}
          <ContractTile id={0} newContract={this.state.newContract} statements={this.state.statements} updateStatement={this.updateStatement} getCurrId={this.getCurrId}/>
        </div>

        <div className="ContractName">
            <input value={this.state.contractName} onChange={e => this.setState({contractName: e.target.value})} placeholder="Set a Contract Name..."/>
        </div>

        <button className="CreateButton" onClick={this.postContract}>Create</button>
        <button className="ProgressButton" onClick={this.progressContract}>Progress</button>

        <div className="UserButton"> 
          <button onClick={e => (userConfirm(this.state.contractName))}>Confirm</button>
          <button onClick={e => (userDeny(this.state.contractName))}>Deny</button>
          <input onChange={e => (this.setState({payContractValue: e.target.value}))}/>
          <button onClick={e => (this.payContract(this.state.contractName))}>Fund Contract</button>
        </div>
        
      </div>
    );
  }
}

export default Contract;