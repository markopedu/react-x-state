import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useMachine } from '@xstate/react';
import { toggleMachine } from './toggleMachine';

function App() {
    const [ current, send ] = useMachine(toggleMachine);

    console.log(current);
    const styles = current.value === 'active' ? { background: 'red' } : { background: 'yellow' };

  return (
    <div  className="App">
      <header style={styles} className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <hr style={{width:'100%'}} />
        <button style={{fontSize: '36px'}} onClick={() => send('TOGGLE')}>Toggle</button>
      </header>
    </div>
  );
}

export default App;
