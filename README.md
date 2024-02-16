## 실행 방법
1. server 폴더로 들어가 node server 서버실행(포트 3000)
2. fridgeweb 폴더에서 npm start->3000번 포트가 실행되고 있으므로 y를 눌러 3001번 포트에서 실행
3. fridgeApp 폴더로 들어가 npx expo start 
4. expo go앱이 있어야하며 expo go 앱을 실행 후 qr코드를 스캔하거나 metro waiting on ~~~~~~ ~부분의 url을 복사하여 붙여넣으면 앱이 실행된다.

## 주의사항
1. git clone으로 파일들을 다운받았다면 npm install을 사용하여 컴포넌트들을 설치 할 것
2. server.js의 Mysql연결 부분에 들어가는 내용의 자신의 데이터베이스에 맞춰서 저장할 것

3. 앱실행시 fridgeApp폴더의 App.js에서 uri를 자신의 ip로 변경할 것

4. 꼭 노트북(컴퓨터)와 같은 와이파이 환경에 있는 앱에서 실행 할 것


## 문제점 및 해결 방안
1. 데이터 저장 시 저장에 실패하는 경우
데이터 저장 오류: SyntaxError: Unexpected token 'P', "Proxy erro"... is not valid JSON

해결 방안 : 서버를 실행하지 않았을 시 생겼던 오류 서버를 먼저 키면 생기지 않는다.

2. CORS (Cross-Origin Resource Sharing) 문제
react-native webview를 활용하여 앱으로 웹을 실행했을때 cors로 인해 데이터 저장,조회,삭제 등 POST나 GET이 실행 되지 않는 문제,React 앱이 데이터를 가져 오려는 서버 또는 API와 다른 도메인 또는 포트에서 실행 중인 경우 생길 수 있다. 앱을 실행하는 EXPO의 포트와 웹을 실행하는 포트가 다른데 같은 서버로 요청을 보내므로 cors 정책이 위반된다.

해결 방안 : package.json에 "proxy" : "http://localhost:3000"를 추가한다. React 앱이 API 서버로의 요청을 보낼 때, 요청이 자동으로 로컬 서버로 라우팅되어 CORS 문제를 해결
