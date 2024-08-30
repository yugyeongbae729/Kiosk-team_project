const express = require('express')
const app = express()
const nunjucks = require('nunjucks')

// ===================================== 세션 관련 라이브러리 불러오기 =====================================
const session = require('express-session')
const fileStore = require('session-file-store')(session)

// ===================================== Router 불러오기 =====================================
const mainRouter = require('./routes/mainRouter')
const userRouter = require('./routes/userRouter')
const kioskRouter = require('./routes/kioskRouter')
const gameRouter = require('./routes/gameRouter')
const macKioskRouter = require('./routes/macKioskRouter')
const learningNote = require('./routes/learningNote');
// ===================================== 넌적스 세팅 부분 =====================================
app.set('view engine', 'html')
nunjucks.configure('views',{
    express : app,
    watch : true
})

// 파비콘 에러 무시
app.get('/favicon.ico', (req, res) => res.status(204));

// ===================================== 세션 미들웨어 세팅 부분 =====================================
app.use(session({
    httpOnly : true,            // http 요청으로 온것만 처리
    resave : false,             // 세션을 항상 재저장할건지?
    secret : 'secret',          // 암호화 할때 사용하는 키
    store : new fileStore(),    // 세션을 어디에 저장할건지?
    saveUninitialized : false   // 세션에 저장할 내용이 없더라도 저장여부
}))

// ===================================== POST 값 받아오기 허용 부분 =====================================
app.use(express.urlencoded({extended : true}))

// ===================================== JSON 형식의 요청 본문 파싱 미들웨어 추가 =====================================
app.use(express.json()); 

// ===================================== PUBLIC폴더 접근 경로 설정 부분 =====================================
app.use(express.static('public'))
app.use(express.static('script'))
app.use(express.static('CSS'))

// ===================================== ('/',라우터 연결) 부분 =====================================
app.use('/', mainRouter)
app.use('/user', userRouter)
app.use('/kiosk', kioskRouter)
app.use('/game',gameRouter)
app.use('/macKiosk', macKioskRouter)
app.use('/learningNote', learningNote)
// ===================================== port 연결 부분 =====================================
app.listen(3000, ()=>{
    console.log("3000 port waiting...");
})
// 번역 api호출 위한 추가코드-----
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const port = 3000;

// app.use(bodyParser.json());
// app.use(express.static('public')); // HTML 파일을 서빙하기 위한 설정

// const apiKey = 'AIzaSyDTtd9JTFAIkuR4rwLjU1IRuL2WEO97rh0'; // Google Cloud Translation API 키를 입력하세요

// app.post('/translate', async (req, res) => {
//     const { text, targetLanguage } = req.body;

//     try {
//         const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, null, {
//             params: {
//                 q: text,
//                 target: targetLanguage,
//                 key: apiKey
//             }
//         });
//         res.json({ translatedText: response.data.data.translations[0].translatedText });
//     } catch (error) {
//         console.error('Error during translation:', error);
//         res.status(500).send('Error during translation');
//     }
// });

//-----번역 코드 끝
