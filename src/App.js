import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './calendar.js';
import Search from './search';
import SearchResults from './searchResult.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>냉장고를 부탁해</h1>
        <Routes>
          <Route path="/" element={<CombinedComponent />} />
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  );
}

function CombinedComponent() {
  return (
    <div className='CombinedComponet'>
      <Search />
      <Calendar />
    </div>
  );
}

export default App;














