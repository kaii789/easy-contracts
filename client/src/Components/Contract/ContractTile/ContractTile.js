import "./ContractTile.css";

import React from "react";
import Arrow from "../Arrow/Arrow";
import Substatement from "../Substatement/Substatement";

function getJumpId(actions) {
  let ret = -1;
  actions.forEach(action => {
    if(action.selected_option && action.selected_option.label === "Jump") {
      ret = parseInt(action.intArgs);
    }
  });
  return ret
}


class ContractTile extends React.Component {
  constructor(props) {
    super(props);

    this.jumpIds = [-1, -1, -1];
    this.arrows = [null, null, null];
    this.substatementTypes = ["conditions", "consequents", "alternatives"];
    this.texts = ["If", "Then", "Else"];
    this.colors = ["rgba(0, 128, 255, 0.6)", "rgba(0, 255, 0, 0.5)", "rgba(255, 0, 0, 0.6)"];

    this.setJumpsAndArrows = this.setJumpsAndArrows.bind(this);
  };


  setJumpsAndArrows() {
    let cons_jump_id = getJumpId(this.props.statements[this.props.id].consequents);
    let alt_jump_id = getJumpId(this.props.statements[this.props.id].alternatives);

    this.jumpIds = [-1, cons_jump_id, alt_jump_id];


    this.arrows = [null, null, null];
  
    if (cons_jump_id !== -1 && alt_jump_id !== -1) {
      this.arrows[1] = <Arrow key={1} color="green" x1="0" y1="50" x2="50" y2="5"/>;
      this.arrows[2] = <Arrow key={2} color="red" x1="0" y1="50" x2="50" y2="95"/>;
    } else if (cons_jump_id !== -1) {
      this.arrows[1] = <Arrow key={1} color="green" x1="0" y1="50" x2="90" y2="50"/>;
    } else if (alt_jump_id !== -1) {
      this.arrows[2] = <Arrow key={2} color="red" x1="0" y1="50" x2="90" y2="50"/>;
    }
  }


  render() {
    this.setJumpsAndArrows();

    let substatements = [];
    for (let i = 0; i < 3; i++) {
      substatements.push(
        <div key={i} className="ArrowWrapper">
          <Substatement text={this.texts[i]} borderColor={this.colors[i]} statements={this.props.statements} id={this.props.id} substatementType={this.substatementTypes[i]} updateStatement={this.props.updateStatement} getCurrId={this.props.getCurrId} jumpId={this.jumpIds[i]}/>
          <div>{this.arrows[i]}</div>
        </div>
    );}

    let child_tiles = [];
    for (let i = 1; i < 3; i++) {
      child_tiles.push(
        <div key={i} style={{display: "flex", alignItems: "left"}}>
          {this.jumpIds[i] !== -1 &&
          <ContractTile id={this.jumpIds[i]} newContract={this.props.newContract} statements={this.props.statements} updateStatement={this.props.updateStatement} getCurrId={this.props.getCurrId}/>}
        </div>
    );}

    return (
      <div className="TileWrapper" style={this.props.newContract ? {} : {pointerEvents: "none"}}>
        <div className="Tile">
          <div className="SubStatementWrapper">Statement <b>{this.props.id}</b></div>
          {substatements}
        </div>
        <div>{child_tiles}</div>
      </div>
    );
  }
} export default ContractTile;
