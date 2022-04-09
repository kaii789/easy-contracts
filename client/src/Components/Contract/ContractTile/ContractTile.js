import "./ContractTile.css";

import React from "react";
import { default as ReactSelect } from "react-select";
import {ConditionsOptions, ActionsOptions } from "../Options/Options.js";
import { green_angled_arrow, green_straight_arrow, red_angled_arrow, red_straight_arrow } from "../Arrows/Arrows";


class ContractTile extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        consequentsActionsOptions: JSON.parse(JSON.stringify(ActionsOptions)),
        alternativesActionsOptions: JSON.parse(JSON.stringify(ActionsOptions)),
      }

      this.handleConditionsChange = this.handleConditionsChange.bind(this);
      this.handleConsequentsChange = this.handleConsequentsChange.bind(this);
      this.handleAlternativesChange = this.handleAlternativesChange.bind(this);

      this.handleConditionsArgumentsChange = this.handleConditionsArgumentsChange.bind(this);
    };


    handleConditionsChange(i, selected) {
      let new_statement = {...this.props.statements[this.props.id]};

      // If selection was removed, remove the corresponding condition
      if (!selected) {
        new_statement.conditions.splice(i, 1);
        new_statement.conditions[new_statement.conditions.length - 1].selected_option = null;  // must update this for some reason for dropdown to update correctly
      }
      // Otherwise set current selection and add new empty field 
      else {
        new_statement.conditions[i].selected_option = selected;
        new_statement.conditions.push({});
      }

      this.props.updateStatement(this.props.id, new_statement);
    };


    handleConsequentsChange(i, selected) {
      let new_statement = {...this.props.statements[this.props.id]};
      let jump_statement_id = false;

      // If selection was removed, remove the corresponding condition
      if (!selected) {
        let removed_consequent = new_statement.consequents.splice(i, 1)[0];
        new_statement.consequents[new_statement.consequents.length - 1].selected_option = null;  // must update this for some reason for dropdown to update correctly

        if (removed_consequent.selected_option.label === "Jump") {
          let new_options = this.state.consequentsActionsOptions;
          new_options.unshift({value: "0", label: "Jump"});  // Restore jump option
          this.setState({consequentsActionsOptions: new_options});
        }
      }
      // Otherwise set current selection and add new empty field 
      else {
        new_statement.consequents[i].selected_option = selected;
        new_statement.consequents.push({});

        if (selected.label === "Jump") {
          let new_options = this.state.consequentsActionsOptions;
          new_options.shift();  // Remove jump option
          this.setState({consequentsActionsOptions: new_options});

          jump_statement_id = this.props.getCurrId();
          new_statement.consequents[i].intArgs = String(jump_statement_id);
        }
      }

      this.props.updateStatement(this.props.id, new_statement, jump_statement_id);
    };


    handleAlternativesChange(i, selected) {
      let new_statement = {...this.props.statements[this.props.id]};
      let jump_statement_id = false;

      // If selection was removed, remove the corresponding condition
      if (!selected) {
        let removed_alternative = new_statement.alternatives.splice(i, 1)[0];
        new_statement.alternatives[new_statement.alternatives.length - 1].selected_option = null;  // must update this for some reason for dropdown to update correctly

        // Restore Jump as an option
        if (removed_alternative.selected_option.label === "Jump") {
          let new_options = this.state.alternativesActionsOptions;
          new_options.unshift({value: "0", label: "Jump"});  // Restore jump option
          this.setState({alternativesActionsOptions: new_options});
        }
      }
      // Otherwise set current selection and add new empty field 
      else {
        new_statement.alternatives[i].selected_option = selected;
        new_statement.alternatives.push({});

        if (selected.label === "Jump") {
          let new_options = this.state.alternativesActionsOptions;
          new_options.shift();  // Remove jump option
          this.setState({alternativesActionsOptions: new_options});

          jump_statement_id = this.props.getCurrId();
          new_statement.alternatives[i].intArgs = String(jump_statement_id);
        }
      }

      this.props.updateStatement(this.props.id, new_statement, jump_statement_id);
    };


    handleConditionsArgumentsChange(i, update) {
      let new_statement = {...this.props.statements[this.props.id]};

      new_statement.conditions[i] = {...new_statement.conditions[i], ...update};

      this.props.updateStatement(this.props.id, new_statement);
    }


    handleConsequentsArgumentsChange(i, update) {
      let new_statement = {...this.props.statements[this.props.id]};

      new_statement.consequents[i] = {...new_statement.consequents[i], ...update};

      this.props.updateStatement(this.props.id, new_statement);
    }


    handleAlternativesArgumentsChange(i, update) {
      let new_statement = {...this.props.statements[this.props.id]};

      new_statement.alternatives[i] = {...new_statement.alternatives[i], ...update};

      this.props.updateStatement(this.props.id, new_statement);
    }
    

    render() {

      let cons_jump_id = -1;
      
      this.props.statements[this.props.id].consequents.forEach(e => {
        if(e.selected_option && e.selected_option.label === "Jump") {
          cons_jump_id = parseInt(e.intArgs);
        }
      });

      let show_green_straight_arrow = cons_jump_id !== -1;
      let show_green_angled_arrow = false;


      let alt_jump_id = -1;
      
      this.props.statements[this.props.id].alternatives.forEach((e, i) => {
        if(e.selected_option && e.selected_option.label === "Jump") {
          alt_jump_id = parseInt(e.intArgs);
        }
      });
     
      let show_red_straight_arrow = alt_jump_id !== -1;
      let show_red_angled_arrow = false;

      if (show_green_straight_arrow && show_red_straight_arrow) {
        show_green_straight_arrow = false;
        show_red_straight_arrow = false;

        show_green_angled_arrow = true;
        show_red_angled_arrow = true;
      }


      return (
        <div className="TileWrapper" style={this.props.newContract ? {} : {pointerEvents: "none"}}>
          <div className="Tile">
            <div className="SubStatementWrapper">
              Statement <b>{this.props.id}</b>
            </div>
            
            <div className="SubStatementWrapper" style={{borderColor: "rgba(0, 128, 255, 0.6)"}}>
              If
              {
                this.props.statements[this.props.id].conditions.map((condition, i) => {
                  return (
                    <div key={"condition_"+i}>
                      {i !== 0 && <br/>}
                      {i !== 0 && "and"}
                      <ReactSelect
                        className="DropdownSelect"
                        options={ConditionsOptions}
                        closeMenuOnSelect={true}
                        onChange={(selected) => {this.handleConditionsChange(i, selected)}}
                        isClearable={true}
                        value={condition.selected_option}
                      />
                      {
                        (condition.selected_option) &&
                        <div>
                          <input onChange={e => (this.handleConditionsArgumentsChange(i, {strArgs: String(e.target.value)}))} value={condition.strArgs || ""} placeholder="str arguments..." />
                          <input onChange={e => (this.handleConditionsArgumentsChange(i, {intArgs: String(e.target.value)}))} value={condition.intArgs || ""} placeholder="int arguments..." />
                          {/* Using "addr" instead of "address" to avoid triggering browser address autofill */}
                          <input onChange={e => (this.handleConditionsArgumentsChange(i, {addrArgs: String(e.target.value)}))} value={condition.addrArgs || ""} placeholder="addr arguments..." />
                        </div>
                      }
                    </div>
                    )
                })   
              }
            </div>
            
            <div className="ArrowWrapper">
              <div className="SubStatementWrapper" style={{borderColor: "rgba(0, 255, 0, 0.5)"}}>
                Then
                  {
                    this.props.statements[this.props.id].consequents.map((consequent, i) => {
                      return (
                        <div key={"consequent_"+i}>
                          {i !== 0 && <br/>}
                          {i !== 0 && "and"}
                          <ReactSelect
                            className="DropdownSelect"
                            options={this.state.consequentsActionsOptions}
                            closeMenuOnSelect={true}
                            onChange={(selected) => {this.handleConsequentsChange(i, selected)}}
                            isClearable={true}
                            value={consequent.selected_option}
                          />
                          {
                            (consequent.selected_option && consequent.selected_option.label !== "Jump") &&
                            <div>
                              <input onChange={e => (this.handleConsequentsArgumentsChange(i, {strArgs: String(e.target.value)}))} value={consequent.strArgs || ""} placeholder="str arguments..." />
                              <input onChange={e => (this.handleConsequentsArgumentsChange(i, {intArgs: String(e.target.value)}))} value={consequent.intArgs || ""} placeholder="int arguments..." />
                              {/* Using "addr" instead of "address" to avoid triggering browser address autofill */}
                              <input onChange={e => (this.handleConsequentsArgumentsChange(i, {addrArgs: String(e.target.value)}))} value={consequent.addrArgs || ""} placeholder="addr arguments..." />
                            </div>
                          }
                          {
                            (consequent.selected_option && consequent.selected_option.label === "Jump") &&
                            <div>
                              <span>to Statement {cons_jump_id}</span>
                            </div>
                          }
                        </div>
                      )
                    })
                  }          
              </div>

              <div>
                  {show_green_straight_arrow && green_straight_arrow}
                  {show_green_angled_arrow && green_angled_arrow}
              </div>
            </div>
          
            <div className="ArrowWrapper">
              <div className="SubStatementWrapper" style={{borderColor: "rgba(255, 0, 0, 0.6)"}}>
                Else
                {
                  this.props.statements[this.props.id].alternatives.map((alternative, i) => {
                    return (
                      <div key={"alternative_"+i}>
                        {i !== 0 && <br/>}
                        {i !== 0 && "and"}
                        <ReactSelect
                          className="DropdownSelect"
                          options={this.state.alternativesActionsOptions}
                          closeMenuOnSelect={true}
                          onChange={(selected) => {this.handleAlternativesChange(i, selected)}}
                          isClearable={true}
                          value={alternative.selected_option}
                        />
                        {
                          (alternative.selected_option && alternative.selected_option.label !== "Jump") &&
                          <div>
                            <input onChange={e => (this.handleAlternativesArgumentsChange(i, {strArgs: String(e.target.value)}))} value={alternative.strArgs || ""} placeholder="str arguments..." />
                            <input onChange={e => (this.handleAlternativesArgumentsChange(i, {intArgs: String(e.target.value)}))} value={alternative.intArgs || ""} placeholder="int arguments..." />
                            {/* Using "addr" instead of "address" to avoid triggering browser address autofill */}
                            <input onChange={e => (this.handleAlternativesArgumentsChange(i, {addrArgs: String(e.target.value)}))} value={alternative.addrArgs || ""} placeholder="addr arguments..." />
                          </div>
                        }
                        {
                          (alternative.selected_option && alternative.selected_option.label === "Jump") &&
                          <div>
                            <span>to Statement {alt_jump_id}</span>
                          </div>
                        }
                      </div>
                    )
                  })   
                }
              </div>

              <div>
                  {show_red_straight_arrow && red_straight_arrow}
                  {show_red_angled_arrow && red_angled_arrow}
              </div>
            </div>
          </div>

          <div>
            <div style={{display: "flex", alignItems: "left"}}>
              {
                cons_jump_id !== -1 &&
                <ContractTile id={cons_jump_id} newContract={this.props.newContract} statements={this.props.statements} updateStatement={this.props.updateStatement} getCurrId={this.props.getCurrId}/>
              }
            </div>
            
            <div style={{display: "flex", alignItems: "left"}}>
              {
                alt_jump_id !== -1 &&
                <ContractTile id={alt_jump_id} newContract={this.props.newContract} statements={this.props.statements} updateStatement={this.props.updateStatement} getCurrId={this.props.getCurrId}/>
              }
            </div>
          </div>
        </div>
      );
    }
  }
  
export default ContractTile;