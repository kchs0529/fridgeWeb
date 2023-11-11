import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Calendar from './calendar.js';
import Search from './search';
import SearchResults from './searchResult.js';
import AllDataPage from './AllDataPage';
import BlueToothInput from './BlueToothInput';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className='title-container'>
          <h1>냉장고를 부탁해</h1>
        </div>
        <Routes>
          <Route path="/" element={<CombinedComponent />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/all-data" element={<AllDataPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function CombinedComponent() {
  const [showBlueToothInput, setShowBlueToothInput] = useState(false);
  const navigate = useNavigate();

  // 블루투스 입력창의 표시를 토글하는 함수
  function toggleBlueToothInput() {
    setShowBlueToothInput(prev => !prev);
  }

  // 냉장고 페이지로 이동하는 함수
  function navigateToAllData() {
    navigate('/all-data');
  }

  return (
    <div className='CombinedComponent'>
      <div className="search-bar">
        <div className='searchbox'>
          <Search />
        </div>
        <div className="button-container">
          <button onClick={navigateToAllData} className="all-data-button">냉장고</button>
          <button onClick={toggleBlueToothInput} className="bluetooth-toggle-button">
            블루투스
          </button>
          {showBlueToothInput && <BlueToothInput />}
        </div>
      </div>
      <Calendar />
    </div>
  );
}

export default App;
















