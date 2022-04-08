export const red_angled_arrow =  (
    <svg height="100" width="100">
      <defs>
          <marker id="redMarkerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6"
                orient="auto">
              <path d="M2,2 L2,11 L10,6 L2,2" style={{fill: "red"}} />
          </marker>
      </defs>
      
      <line x1="0" y1="50" x2="50" y2="95" style={{stroke: "red", strokeWdith: 2, markerEnd: "url(#redMarkerArrow)"}}/>
    </svg>
  )
  
export const red_straight_arrow =  (
    <svg height="20" width="100">
      <defs>
          <marker id="redMarkerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6"
                orient="auto">
              <path d="M2,2 L2,11 L10,6 L2,2" style={{fill: "red"}} />
          </marker>
      </defs>
      
      <line x1="0" y1="10" x2="90" y2="10" style={{stroke: "red", strokeWdith: 2, markerEnd: "url(#redMarkerArrow)"}}/>
    </svg>
  )
  
export const green_angled_arrow =  (
    <svg height="100" width="100">
      <defs>
          <marker id="greenMarkerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6"
                orient="auto">
              <path d="M2,2 L2,11 L10,6 L2,2" style={{fill: "green"}} />
          </marker>
      </defs>
      
      <line x1="0" y1="50" x2="50" y2="5" style={{stroke: "green", strokeWdith: 2, markerEnd: "url(#greenMarkerArrow)"}}/>
    </svg>
  )
  
 export const green_straight_arrow =  (
    <svg height="20" width="100">
      <defs>
          <marker id="greenMarkerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6"
                orient="auto">
              <path d="M2,2 L2,11 L10,6 L2,2" style={{fill: "green"}} />
          </marker>
      </defs>
      
      <line x1="0" y1="10" x2="90" y2="10" style={{stroke: "green", strokeWdith: 2, markerEnd: "url(#greenMarkerArrow)"}}/>
    </svg>
  )