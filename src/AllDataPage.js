import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AllDataPage() {
  const [allData, setAllData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 모든 정보를 가져오는 API 호출
    fetch('/getAllData')
      .then((response) => response.json())
      .then((data) => {
        setAllData(data); // 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
  }, []);

  return (
    <div>
      <h2>냉장고</h2>
      <table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>유통 기한</th>
            <th>카테고리 코드</th>
          </tr>
        </thead>
        <tbody>
          {allData.map((item, index) => (
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
}

export default AllDataPage;
