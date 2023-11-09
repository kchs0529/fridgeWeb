import React,{Component} from "react";


class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            currentDate: this.props.highlightDate,
            isInputOpen: false, // 입력 창을 열고 닫는 상태
            isOutputOpen: false,
            selectedDate: null, // 선택한 날짜
            productName: "",
            expirationDate: "",
            categoryCode: "",
            productData: []
        }
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
    }

    handleYearChange(change) {
        var date = new Date(this.state.currentDate);
        var newCurrentDate = date.setFullYear(date.getFullYear() + change);
        this.setState({ currentDate: newCurrentDate })
    }

    handleMonthChange(change) {
        var date = new Date(this.state.currentDate);
        var newCurrentDate = date.setMonth(date.getMonth() + change);
        this.setState({ currentDate: newCurrentDate })
    }

    
    handleDateClick(clickedDate) {
        const selectedDate = new Date(clickedDate);
        const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
        this.setState({
            isInputOpen: true,
            isOutputOpen: true,
            selectedDate: formattedDate, 
            expirationDate: "",
            categoryCode: ""
        });
    
        const url= `http://localhost:3000/getDataByDate?selectedDate=${formattedDate}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                this.setState({ productData: data || [] });
            })
            .catch((error) => {
                console.error('데이터 조회 오류:', error);
        });
    }

    // 입력 창을 닫는 함수
    closeInput() {
        this.setState({ isInputOpen: false });
    }
    
    // 출력 창을 닫기 위한 메소드
    closeOutput() {
        this.setState({ isOutputOpen: false });
    }

    saveData() {
        const { productName, categoryCode, selectedDate, expirationDate } = this.state;
        //제품명이 비어있는지 확인
        if (!productName.trim()) {
            alert("제품명을 입력해주세요.");
            return;
        }
        // categoryCode가 유효한 숫자인지 확인합니다.
        const categoryCodeNumber = parseInt(categoryCode, 10);
        if (isNaN(categoryCodeNumber) || categoryCodeNumber < 0) {
            alert("분류 코드는 0보다 커야 합니다.");
            return;
        }
        const expirationDateObject = new Date(expirationDate);
        const selectedDateObject = new Date(selectedDate);

        // 유통기한이 선택된 날짜보다 이전인지 확인합니다.
        if (expirationDateObject < selectedDateObject) {
            alert("유통기한이 지났습니다.");
            return;
        }
    
        // 저장할 데이터 객체를 생성합니다.
        const data = {
            productName,
            expirationDate, // 상태에서 직접 추출한 값을 사용합니다.
            categoryCode: categoryCodeNumber,
            selectedDate, // 상태에서 직접 추출한 값을 사용합니다.
        };
    
        // POST 요청을 보내서 데이터를 서버로 전송합니다.
        fetch('http://localhost:3000/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            console.log(result); // 성공 또는 실패 메시지를 콘솔에 출력
            alert("저장되었습니다");
        })
        .catch(error => {
            console.error('데이터 저장 오류:', error);
            alert("저장에 실패하였습니다.");
        });
    }

    handleDataDelete(id) {
        // 삭제할 데이터 객체 생성
        const dataToDelete = {
            id
        };
    
        // 서버에 DELETE 요청 보내기
        fetch('http://localhost:3000/deleteData', {
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
    }
    
    render() {
        var currentDate = new Date(this.state.currentDate);

        var fdayMonth = new Date(currentDate).setDate(1);
        var dayOfWeek = new Date(fdayMonth).getDay();
        var fdayCalendar = new Date(fdayMonth).setDate(1 - dayOfWeek);

        let rows = [];

        var loopDate = new Date(fdayCalendar);
        var currentEvent;
        
        for (var i = 0; i < this.props.calendarRows; i++) {
            let tds = [];
            for (var j = 0; j < 7; j++) {
                tds.push(
                    <td
                        key={loopDate.toDateString()} // 각 날짜를 고유하게 식별하기 위한 키
                        data-date={loopDate.toDateString()} // 날짜를 data-date 속성으로 설정
                        className={`${loopDate.wt() === new Date(this.props.highlightDate).wt() ? "today" : ""}
                                    ${loopDate.getMonth() !== currentDate.getMonth() ? "inactive-month" : ""}`
                        }
                        onClick={(e) => this.handleDateClick(e.target.getAttribute("data-date"))} // 클릭 이벤트 핸들러 수정
                    >
                        <span className="date">{loopDate.getDate()}</span>
                    </td>
                );
                loopDate.setDate(loopDate.getDate() + 1);
            }
            rows.push(<tr key={i}>{tds}</tr>);
        }


        let tableRows;
        if (Array.isArray(this.state.productData)) {
            tableRows = this.state.productData
            .map((item, index) => (
                <tr key={item.id}>
                    <td>{index + 1}</td> {/* 번호 */}
                    <td>{item.productName}</td> {/* 제품명 */}
                    <td>{item.expirationDate}</td> {/* 유통기한 */}
                    <td>{item.categoryCode}</td> {/* 분류코드 */}
                    <td>
                    <button
                        onClick={() => this.handleDataDelete(item.id)}
                        
                    >
                        삭제
                    </button>
        </td>
                </tr>
            ));
        } else {
            tableRows = null; // 혹은 다른 기본값을 설정
        }

        

        return (<div style={{ display: "contents" }}>
            <div className="table-container">
                <table id="calendartable">
                    <thead>
                        <tr key="month">
                            <th colSpan="1">
                                <button className="calendar-button" onClick={() => this.handleYearChange(-1)}>&lt;&lt;</button>
                            </th>
                            <th colSpan="1">
                                <button className="calendar-button" onClick={() => this.handleMonthChange(-1)}>&lt;</button>
                            </th>
                            <th colSpan="3">
                                {currentDate.toLocaleString('default', { month: 'short' })}&nbsp; {currentDate.getFullYear()}
                            </th>
                            <th colSpan="1">
                                <button className="calendar-button" onClick={() => this.handleMonthChange(1)}>&gt;</button>
                            </th>
                            <th colSpan="1">
                                <button className="calendar-button" onClick={() => this.handleYearChange(1)}>&gt;&gt;</button>
                            </th>
                        </tr>
                        <tr key="week">
                            {this.props.weekdayFormat.map(day => { return <th className="weekDayNames">{day}</th> })}
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
            {this.state.isInputOpen && (
                    <div className="input-container">
                        <h3>날짜: {this.state.selectedDate}</h3>
                        <input 
                            type="text"
                            placeholder="제품명"
                            value={this.state.productName}
                            onChange={(e) => this.setState({ productName: e.target.value })}
                        />
                        <input 
                            type="date"
                            placeholder="유통기한"
                            value={this.state.expirationDate}
                            onChange={(e) => this.setState({ expirationDate: e.target.value })}
                        />
                        <input 
                            type="number"
                            placeholder="분류코드(1~10)"
                            value={this.state.categoryCode}
                            onChange={(e) => this.setState({ categoryCode: e.target.value })}
                        />
                        <button onClick={() => this.closeInput()}>취소</button>
                        <button onClick={() => this.saveData()}>저장</button>
                    </div>
                )}
                {this.state.isOutputOpen && (
                <div className="output-container">
                    <h3>제품 정보</h3>
                    <table>
                    <thead>
                        <tr>
                        <th>번호</th>
                        <th>제품명</th>
                        <th>유통기한</th>
                        <th>분류코드</th>
                        <th></th> {/* 삭제 버튼 열 추가 */}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                    </table>
                    <button onClick={() => this.closeOutput()}>닫기</button>
                </div>
                )}
            </div>
            
            
        )
    }
}

Calendar.defaultProps =
{
    highlightDate: [new Date()],
    weekdayFormat: ["일", "월", "화", "수", "목", "금", "토"],
    calendarRows: 6,
};

Date.prototype.wt = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

export default Calendar;