const express = require("express"); 
const cors    = require("cors");    
const mysql   = require("mysql");   
const app     = express();
const PORT    = 3000; // 포트번호 설정
const BluetoothSerialPort = require('bluetooth-serial-port').BluetoothSerialPort;
const serial = new BluetoothSerialPort();

// MySQL 연결
const db = mysql.createPool({
    host: "127.0.0.1", // 호스트
    user: "root",      // 데이터베이스 계정
    password: "1234",  // 데이터베이스 비밀번호
    database: "mydb",  // 사용할 데이터베이스
});

app.use(cors({
    origin: 'http://localhost:3001',// 출처 허용 옵션
    credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
}))

app.use(express.json());

// POST 요청을 처리하는 라우트 추가
app.post('/saveData', (req, res) => {
    console.log("POST 요청이 도착했습니다.");

    // 클라이언트로부터 받은 데이터
    const { productName, expirationDate, categoryCode, selectedDate } = req.body;

    console.log("productName:", productName);
    console.log("expirationDate:", expirationDate);
    console.log("categoryCode:", categoryCode);
    console.log("selectedDate:", selectedDate);

    if (categoryCode <= 0) {
        // 분류 코드가 1보다 작거나 같으면 클라이언트에게 에러 응답 보내기
        return res.status(400).json({ error: "분류 코드는 1보다 커야 합니다." });
    }

    // 데이터베이스에 데이터 저장
    const sql = "INSERT INTO products (productName, expirationDate, categoryCode, selectedDate) VALUES (?, ?, ?, ?)";
    db.query(sql, [productName, expirationDate, categoryCode, selectedDate], (err, result) => {
        if (err) {
            console.error('데이터베이스 저장 오류:', err);
            return res.status(500).json({ error: "데이터 저장에 실패했습니다." });
        }
        console.log('데이터가 성공적으로 저장되었습니다.');
        res.status(200).json({ message: "데이터 저장 성공" });
        });
    });

//데이터 가져오기
app.get('/getDataByDate', (req, res) => {
    const { selectedDate } = req.query; // 쿼리 매개변수로 받은 선택한 날짜
    const sql = "SELECT id,productName, expirationDate, categoryCode FROM products WHERE selectedDate = ?";
    console.log("selectedDate:", selectedDate);
    db.query(sql, [selectedDate], (err, result) => {
        if (err) {
            console.error('데이터 조회 오류:', err);
            return res.status(500).json({ error: "데이터를 가져오는 데 실패했습니다." });
        }
        console.log('데이터 조회 성공');

        // expirationDate를 한국 시간대로 변환
        const formattedResult = result.map(item => ({
            id: item.id,
            productName: item.productName,
            expirationDate: new Date(item.expirationDate).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' })
                .replace(/\. /g, '-').replace(/\.$/, ''),
            categoryCode: item.categoryCode
        }));

        res.status(200).json(formattedResult);
    });
});

//삭제
app.delete('/deleteData', (req, res) => {
    console.log("DELETE 요청이 도착했습니다.");

    // 클라이언트로부터 받은 데이터
    const {id} = req.body;


    // 데이터베이스에서 데이터 삭제
    const sql = "DELETE FROM products WHERE id=?";
    console.log("키값",id);
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('데이터 삭제 오류:', err);
            return res.status(500).json({ error: "데이터 삭제에 실패했습니다." });
        }

        if (result.affectedRows === 0) {
            // 삭제된 행이 없을 경우 클라이언트에게 에러 응답 보내기
            return res.status(404).json({ error: "해당 데이터를 찾을 수 없습니다." });
        }

        console.log('데이터가 성공적으로 삭제되었습니다.');
        res.status(200).json({ message: "데이터 삭제 성공" });
    });
});

//검색
app.get('/getDataBySearch', (req, res) => {
    const { searchOption, searchTerm } = req.query;
    let sql = "";
    
    switch (searchOption) {
      case "productName":
        sql = "SELECT id, productName, expirationDate, categoryCode FROM products WHERE productName LIKE ?";
        break;
      case "expirationDate":
        sql = "SELECT id, productName, expirationDate, categoryCode FROM products WHERE expirationDate LIKE ?";
        break;
      case "categoryCode":
        // 숫자로 저장된 카테고리 코드를 정확히 일치하는 경우 검색
        sql = "SELECT id, productName, expirationDate, categoryCode FROM products WHERE categoryCode = ?";
        break;
      default:
        return res.status(400).json({ error: "잘못된 검색 옵션입니다." });
    }
    
    const searchValue = (searchOption === "categoryCode") ? parseInt(searchTerm) : `%${searchTerm}%`;
    
    db.query(sql, [searchValue], (err, result) => {
      if (err) {
        console.error('검색 오류:', err);
        return res.status(500).json({ error: "검색에 실패했습니다." });
      }
    
      const formattedResult = result.map(item => ({
        id: item.id,
        productName: item.productName,
        expirationDate: new Date(item.expirationDate).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' })
            .replace(/\. /g, '-').replace(/\.$/, ''),
        categoryCode: item.categoryCode
      }));
    
      res.status(200).json(formattedResult);
    });
  });
  

// 한국 시간대로 설정된 오늘 날짜를 가져오는 함수
function getKoreanDate() {
    const now = new Date();
    now.setHours(now.getHours() + 9); // UTC에서 KST(UTC+9)로 변환
    return now.toISOString().slice(0, 10); // YYYY-MM-DD 형식
}

// 블루투스 데이터 수신 및 데이터베이스 저장 로직
serial.on('found', function(address, name) {
    serial.findSerialPortChannel(address, function(channel) {
        serial.connect(address, channel, function() {
            console.log('블루투스 연결 성공:', name);

            serial.on('data', function(data) {
                const receivedData = data.toString();
                console.log('수신된 데이터:', receivedData);

                // 받은 데이터를 ','로 구분하여 각 변수에 할당
                const [productName, expirationDate, categoryCode] = receivedData.split(',');

                // selectedDate에 한국 시간대의 오늘 날짜를 설정
                const selectedDate = getKoreanDate();

                // 데이터베이스에 데이터 저장
                const sql = "INSERT INTO products (productName, expirationDate, categoryCode, selectedDate) VALUES (?, ?, ?, ?)";
                db.query(sql, [productName, expirationDate, categoryCode, selectedDate], (err, result) => {
                    if (err) {
                        console.error('데이터베이스 저장 오류:', err);
                        return;
                    }
                    console.log('데이터가 성공적으로 저장되었습니다.');
                });
            });
        }, function () {
            console.log('블루투스 연결을 실패했습니다.');
        });
    });
});

serial.inquire();

// 서버 연결 시 발생
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

