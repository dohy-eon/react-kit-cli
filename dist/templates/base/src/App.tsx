import React from 'react';
import { Counter } from './components/Counter';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>React Kit CLI Demo</h1>
      </header>
      <main>
        <Counter />
      </main>
    </div>
  );
}

export default App;
