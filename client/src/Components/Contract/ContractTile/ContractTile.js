import "./ContractTile.css";

import React from "react";
import { green_angled_arrow, green_straight_arrow, red_angled_arrow, red_straight_arrow } from "../Arrows/Arrows";
import Substatement from "../Substatement/Substatement";


class ContractTile extends React.Component {    

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
            <div>
              Statement <b>{this.props.id}</b>
            </div>
            
            <Substatement text="If" borderColor="rgba(0, 128, 255, 0.6)" statements={this.props.statements} id={this.props.id} substatementType="conditions" updateStatement={this.props.updateStatement} getCurrId={this.props.getCurrId}/>
            
            
            <div className="ArrowWrapper">
              <Substatement text="Then" borderColor="rgba(0, 255, 0, 0.5)" statements={this.props.statements} id={this.props.id} substatementType="consequents" updateStatement={this.props.updateStatement} getCurrId={this.props.getCurrId} jumpId={cons_jump_id}/>

              <div>
                  {show_green_straight_arrow && green_straight_arrow}
                  {show_green_angled_arrow && green_angled_arrow}
              </div>
            </div>
          
            <div className="ArrowWrapper">
              <Substatement text="Else" borderColor="rgba(255, 0, 0, 0.6)" statements={this.props.statements} id={this.props.id} substatementType="alternatives" updateStatement={this.props.updateStatement} getCurrId={this.props.getCurrId} jumpId={alt_jump_id}/>

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