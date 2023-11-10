import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [searchOption, setSearchOption] = useState('productName');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchOptionChange = (e) => {
    const { value } = e.target;
    setSearchOption(value);
    setSearchTerm('');
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const performSearch = () => {
    if (!searchTerm.trim()) {
      // 검색어가 비어 있을 때는 검색을 수행하지 않음
      alert('검색어를 입력해주세요');
      return;
    }
  
    // 검색어가 비어있지 않을 때만 검색 요청 보내기
    fetch(`/getDataBySearch?searchOption=${searchOption}&searchTerm=${searchTerm}`)
      .then((response) => response.json())
      .then((searchResults) => {
        // 검색 결과 페이지로 이동
        navigate('/search-results', { state: { searchResults } });
      })
      .catch((error) => {
        console.error('검색 오류:', error);
      });
  };

  return (
    <div className="search-container">
      <div className="search-option">
        <label htmlFor="searchOption">검색 옵션:</label>
        <select id="searchOption" value={searchOption} onChange={handleSearchOptionChange}>
          <option value="productName">상품명</option>
          <option value="expirationDate">유통 기한</option>
          <option value="categoryCode">카테고리 코드</option>
        </select>
      </div>
      <div className="search-input">
        {searchOption === 'expirationDate' ? (
          <input type="date" value={searchTerm} onChange={handleSearchTermChange} />
        ) : (
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder={`검색 내용을 입력하세요`}
          />
        )}
        <button className="search-button" onClick={performSearch}>검색</button>
      </div>
    </div>
  );
}

export default Search;




