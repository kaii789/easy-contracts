import React from "react";


class Arrow extends React.Component {
  render() {
    return (
      <svg height="100" width="100">
        <defs>
            <marker id={this.props.color + "MarkerArrow"} markerWidth="13" markerHeight="13" refX="2" refY="6"
                  orient="auto">
                <path d="M2,2 L2,11 L10,6 L2,2" style={{fill: this.props.color}} />
            </marker>
        </defs>
        
        <line x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2} style={{stroke: this.props.color, strokeWdith: 2, markerEnd: "url(#" + this.props.color + "MarkerArrow)"}}/>
      </svg>
    )
  }
} export default Arrow;