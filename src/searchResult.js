import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults } = location.state;

  if (!searchResults || searchResults.length === 0) {
    return (
      <div>
        <h2>검색 결과</h2>
        <p>검색 결과가 없습니다.</p>
        <button onClick={() => navigate('/')}>홈으로</button>
      </div>
    );
  }

  return (
    <div className='search-resultcontainer'>
      <h2>검색 결과</h2>
      <table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>유통 기한</th>
            <th>카테고리 코드</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>
              <td>{item.expirationDate}</td>
              <td>{item.categoryCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/')}>홈으로</button>
    </div>
  );
};

export default SearchResults;




