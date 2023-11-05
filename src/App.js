import React, { useState } from 'react';
import Calendar from './calendar.js';
import Fridge from './fridge.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>냉장고를 부탁해</h1>
      <Calendar />
      <h1>내 냉장고</h1>
      <Fridge />
    </div>
  );
}

export default App;


