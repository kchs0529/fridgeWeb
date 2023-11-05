const express = require("express"); 
const cors    = require("cors");    
const mysql   = require("mysql");   
const app     = express();
const PORT    = 3000; // 포트번호 설정

// MySQL 연결
const db = mysql.createPool({
    host: "127.0.0.1", // 호스트
    user: "root",      // 데이터베이스 계정
    password: "1234",  // 데이터베이스 비밀번호
    database: "mydb",  // 사용할 데이터베이스
});

app.use(cors({
    origin: "*",                // 출처 허용 옵션
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

// 서버 연결 시 발생
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

