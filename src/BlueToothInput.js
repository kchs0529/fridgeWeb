import React from 'react';

class BlueToothInput extends React.Component {
    state = {
      input: '',
    };
  
    handleChange = (e) => {
      this.setState({ input: e.target.value });
    };
  
    handleSubmit = (e) => {
      e.preventDefault();
  
      const [productName, expirationDate, categoryCodeString] = this.state.input.split(',');
      const categoryCode = parseInt(categoryCodeString, 10);
  
      // categoryCode 검증
      if (isNaN(categoryCode) || categoryCode <= 0) {
        alert('분류 코드는 양의 정수여야 합니다.');
        return;
      }
  
      const selectedDate = new Date().toISOString().split('T')[0];
  
      // 서버에 데이터 전송
      fetch('/saveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          expirationDate,
          categoryCode,
          selectedDate
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error); // 오류가 있을 경우 alert로 사용자에게 알림
        } else {
          alert('데이터가 저장되었습니다.'); // 데이터 저장 성공시 알림
          this.setState({ input: '' }); // 입력창 초기화
        }
      })
      .catch(error => {
        alert('데이터 저장 중 오류가 발생했습니다.'); // 네트워크 오류 등의 경우
      });
    };
  
    render() {
      return (
        <form onSubmit={this.handleSubmit} className="BlueToothInput">
          <input
            type="text"
            className='BlueToothInput-text'
            value={this.state.input}
            onChange={this.handleChange}
            placeholder="예: apple,2023-11-14,3"
          />
          <button className="BlueToothInput-button"type="submit">데이터 저장</button>
        </form>
      );
    }
  }
  
  export default BlueToothInput;
  
  
  
  
  