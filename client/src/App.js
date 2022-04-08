import React from "react";
import './App.css';

import Contract from './Components/Contract/Contract/Contract';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Contract newContract={true}/>
        </header>
      </div>
    );
  }
}

export default App;