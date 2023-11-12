import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function AllDataPage() {
  const [allData, setAllData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/getAllData')
      .then((response) => response.json())
      .then((data) => {
        // 데이터를 받아온 후 클라이언트에서 다시 정렬
        const sortedData = data.sort((a, b) => {
          return new Date(a.expirationDate) - new Date(b.expirationDate);
        });
        setAllData(sortedData);
        console.log(data);
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
  }, []);

  // expirationDate가 지났는지 확인하는 함수
  const isExpired = (expirationDate) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return new Date(expirationDate) < currentDate;
  };

  
  const handleDataDelete = (id) => {
    // 삭제할 데이터 객체 생성
    const dataToDelete = {
      id
    };

    // 서버에 DELETE 요청 보내기
    fetch(`/deleteData`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToDelete),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result); // 성공 또는 실패 처리
        if (result.message === "데이터 삭제 성공") {
          alert("데이터가 삭제되었습니다.");
          // 삭제 성공 시 화면을 새로 고침
          window.location.reload();
        } else {
          alert("데이터 삭제에 실패하였습니다.");
        }
      })
      .catch((error) => {
        console.error('데이터 삭제 오류:', error);
        alert("데이터 삭제에 실패하였습니다.");
      });
  };

  

  return (
    <div>
      <h2>냉장고</h2>
      <div className='allData-container'>
        <table>
          <thead>
            <tr>
              <th>상품명</th>
              <th>유통 기한</th>
              <th>카테고리 코드</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allData.map((item, index) => (
              <tr key={index}>
                <td style={{color:'black'}}>{item.productName}</td>
                <td style={{ color: isExpired(item.expirationDate) ? 'red' : 'black' }}>{item.expirationDate}</td>
                <td>{item.categoryCode}</td>
                <td>
                <button
                  onClick={() => handleDataDelete(item.id)} 
                >
                  삭제
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate('/')}>홈으로</button>
      </div>
    </div>
  );
}

export default AllDataPage;


