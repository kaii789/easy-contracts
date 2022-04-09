import React from "react";
import { default as ReactSelect } from "react-select";
import {ConditionsOptions, ActionsOptions } from "../Options/Options.js";


class Substatement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actionsOptions: JSON.parse(JSON.stringify(ActionsOptions)),
    }

    this.handleSelectedChange = this.handleSelectedChange.bind(this);
    this.handleArgumentsChange = this.handleArgumentsChange.bind(this);
  };


  handleSelectedChange(substatement, i, selected) {
    let new_statement = {...this.props.statements[this.props.id]};
    let jump_statement_id = false;

    // If selection was removed, remove the corresponding substatement
    if (!selected) {
      let removed_substatement = new_statement[substatement].splice(i, 1)[0];
      new_statement[substatement][new_statement[substatement].length - 1].selected_option = null;  // must update this for some reason for dropdown to update correctly

      if (removed_substatement.selected_option.label === "Jump") {
        let new_options = this.state.actionsOptions;
        new_options.unshift({value: "0", label: "Jump"});  // Restore jump option
        this.setState({actionsOptions: new_options});
      }
    }
    // Otherwise set current selection and add new empty field 
    else {
      new_statement[substatement][i].selected_option = selected;
      new_statement[substatement].push({});

      if (selected.label === "Jump") {
        let new_options = this.state.actionsOptions;
        new_options.shift();  // Remove jump option
        this.setState({actionsOptions: new_options});

        jump_statement_id = this.props.getCurrId();
        new_statement[substatement][i].intArgs = String(jump_statement_id);
      }
    }

    this.props.updateStatement(this.props.id, new_statement, jump_statement_id);
  };


  handleArgumentsChange(substatement, i, update) {
    let new_statement = {...this.props.statements[this.props.id]};

    new_statement[substatement][i] = {...new_statement[substatement][i], ...update};

    this.props.updateStatement(this.props.id, new_statement);
  }


  render() {
    return (
      <div className="SubStatementWrapper" style={{borderColor: this.props.borderColor}}>
        {this.props.text}
        {
          this.props.statements[this.props.id][this.props.substatementType].map((e, i) => {
            return (
              <div key={this.props.substatementType+"_"+i}>
                {i !== 0 && <br/>}
                {i !== 0 && "and"}
                <ReactSelect
                  className="DropdownSelect"
                  options={this.props.substatementType === "conditions" ? ConditionsOptions : ActionsOptions}
                  closeMenuOnSelect={true}
                  onChange={(selected) => {this.handleSelectedChange(this.props.substatementType, i, selected)}}
                  isClearable={true}
                  value={e.selected_option}
                />
                {
                  (e.selected_option && e.selected_option.label !== "Jump") && 
                  <div>
                    <input onChange={e => (this.handleArgumentsChange(this.props.substatementType, i, {strArgs: String(e.target.value)}))} value={e.strArgs || ""} placeholder="str arguments..." />
                    <input onChange={e => (this.handleArgumentsChange(this.props.substatementType, i, {intArgs: String(e.target.value)}))} value={e.intArgs || ""} placeholder="int arguments..." />
                    {/* Using "addr" instead of "address" to avoid triggering browser address autofill */}
                    <input onChange={e => (this.handleArgumentsChange(this.props.substatementType, i, {addrArgs: String(e.target.value)}))} value={e.addrArgs || ""} placeholder="addr arguments..." />
                  </div>
                }
                {
                  (e.selected_option && e.selected_option.label === "Jump") &&
                  <div>
                    <span>to Statement {this.props.jumpId}</span>
                  </div>
                }
              </div>
            )
          })   
        }
      </div>
    )
  }
}
export default Substatement;