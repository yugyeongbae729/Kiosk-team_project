const express = require('express');
const router = express.Router();
const conn = require('../config/db');

// 새 페이지 정보 가져오기
router.get('/get-user-notes', (req, res) => {
    if (req.session.nick) {
        const query = `
            SELECT INFO_PAGENAME, NOTE_DATE
            FROM KIOSK_NOTE_TB
            WHERE USER_NICK = ?
            ORDER BY NOTE_DATE DESC`;
        
        conn.query(query, [req.session.nick], (error, results) => {
            if (error) {
                console.error('데이터베이스 쿼리 오류:', error);
                res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
            } else {
                res.json({ success: true, data: results });
            }
        });
    } else {
        res.json({ success: false, message: '로그인한 회원만 접근할 수 있습니다.' });
    }
});

module.exports = router;
