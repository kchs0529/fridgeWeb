import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Calendar from './calendar.js';
import Search from './search';
import SearchResults from './searchResult.js';
import AllDataPage from './AllDataPage';
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
  return (
    <div className='CombinedComponet'>
      <div className="search-bar">
        <Search />
        <button onClick={navigateToAllData} className="all-data-button">냉장고로 이동</button>
      </div>
      <Calendar />
    </div>
  );
}

function navigateToAllData() {
  
  window.location.href = '/all-data';
}

export default App;
















