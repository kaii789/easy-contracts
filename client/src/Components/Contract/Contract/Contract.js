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
    this.parseSubstatements = this.parseSubstatements.bind(this);
    this.parseArgs = this.parseArgs.bind(this);
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


  parseArgs(substatement, arg) {
    let result = [];

    if (substatement[arg] !== null && substatement[arg] !== undefined) {
      result = substatement[arg].split(",").map(e => {
        switch(arg) {
          case "addrArgs":
            return e.trim().toLowerCase();
          case "intArgs":
            return parseInt(e.trim());
          default:
            return e.trim();
        }
      });
    }

    return result;
  }

  parseSubstatements(curr_statement, substatement, num_statements_added) {
    let result = [];

    let jump_idx = -1;

    for (let j = 0; j < curr_statement[substatement].length; j++) {
      if (Object.keys(curr_statement[substatement][j]).length === 0  || !curr_statement[substatement][j].selected_option) {
        continue;
      }

      let type = parseInt(curr_statement[substatement][j].selected_option.value);

      let str_args = this.parseArgs(curr_statement[substatement][j], "strArgs");

      let int_args = this.parseArgs(curr_statement[substatement][j], "intArgs");

      let addr_args = this.parseArgs(curr_statement[substatement][j], "addrArgs");

      // Jump workaround
      if (substatement !== "conditions" && type === 0) {
        jump_idx = int_args[0];
        int_args[0] = num_statements_added+1;  // change arg to actual statement index
      }

      let new_substatement = {"strArgs": str_args, "intArgs": int_args, "addrArgs": addr_args};

      let key = substatement === "conditions" ? "conditionType" : "actionType";
      let val = type;

      new_substatement[key] = val;

      result.push(new_substatement);
    }

    return [result, jump_idx];
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

        let conditions = this.parseSubstatements(curr_statement, "conditions", num_statements_added)[0];

        let parsedConsequents = this.parseSubstatements(curr_statement, "consequents", num_statements_added);

        let consequents = parsedConsequents[0];

        // If jump, make sure we're jumping to the correct statement number
        // This workaround can be circumvented by adding an id field for statements on 
        // the smart contract side of thing
        if (parsedConsequents[1] !== -1) {
          queue.push(this.state.statements[parsedConsequents[1]]);
          num_statements_added++;
        }

        let parsedAlternatives = this.parseSubstatements(curr_statement, "alternatives", num_statements_added);

        let alternatives = parsedAlternatives[0];

        if (parsedAlternatives[1] !== -1) {
          queue.push(this.state.statements[parsedAlternatives[1]]);
          num_statements_added++;
        }

        success &= await addStatement(contractName, conditions, consequents, alternatives);
      }
    }
    catch (err) {
      success = false;
      console.log(err);
    }

    if (!success) {
      // Enable edits again since we weren't able to upload this contract, edits may be needed
      this.setState({newContract: true});

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