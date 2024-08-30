const express = require('express');
const router = express.Router();
const conn = require('../config/db');

// 페이지 정보 저장 라우트
router.post('/save-page-info', (req, res) => {
    const infoPageNum = req.body.infoPageNum; // 클라이언트로부터 전달받은 infoPageNum
    const infoPageName = req.body.infoPageName;

    if (req.session.nick) {
        const userNick = req.session.nick;
        const catIdx = 1; // 예시값
        const noteDate = new Date();

        const query = `
            INSERT INTO KIOSK_NOTE_TB (USER_NICK, CAT_IDX, NOTE_DATE, INFO_PAGENUM, INFO_PAGENAME)
            VALUES (?, ?, ?, ?, ?)`;
        
        console.log('Executing query:', query);
        console.log('With values:', [userNick, catIdx, noteDate, infoPageNum, infoPageName]);

        conn.query(query, [userNick, catIdx, noteDate, infoPageNum, infoPageName], (error, results) => {
            if (error) {
                console.error('데이터베이스 쿼리 오류:', error);
                res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
            } else {
                console.log('Query executed successfully:', results);
                res.json({ success: true });
            }
        });
    } else {
        res.json({ success: false, message: '학습 저장은 로그인한 회원만 이용할 수 있습니다.' });
    }
});

module.exports = router;
