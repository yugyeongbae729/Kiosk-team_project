const express = require('express');
const router = express.Router();
const conn = require('../config/db');

// 별명 중복 확인 라우트
router.post('/checkNick', (req, res) => {
    const { nick } = req.body;
    if (!nick) {
        return res.json({ exists: false });
    }

    let checkNickSql = "SELECT * FROM KIOSK_USER_TB WHERE USER_NICK = ?";
    conn.query(checkNickSql, [nick], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: '오류가 발생했습니다. 다시 시도해주세요.' });
        }
        if (results.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    });
});

// 회원가입
router.post('/join', (req, res) => {
    console.log('asdfasdf');
    console.log('join 실행', req.body);

    let { nick, pw, pwck, btd, gen } = req.body;

    if (!nick || !pw) {
   return res.send("<script>alert('별명과 비밀번호를 입력해주세요'); window.history.back();</script>");
    } else if (pw !== pwck) {
        return res.send("<script>alert('비밀번호가 일치하지 않습니다.'); window.history.back();</script>");
    }

    let checkNickSql = "SELECT * FROM KIOSK_USER_TB WHERE USER_NICK = ?";
    conn.query(checkNickSql, [nick], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("<script>alert('오류가 발생했습니다. 다시 시도해주세요.'); window.history.back();</script>");
        }

        if (results.length > 0) {
            return res.send("<script>alert('이미 존재하는 별명입니다'); window.history.back();</script>");
        }
        let sql = "INSERT INTO KIOSK_USER_TB (USER_NICK, USER_PW, USER_BTD, USER_GENDER) VALUES (?, ?, ?, ?)";
        conn.query(sql, [nick, pw, btd, gen], (err, rows) => {
            if (err) {
                console.error(err);
                return res.send("<script>alert('오류가 발생했습니다. 다시 시도해주세요.'); window.history.back();</script>");
            }
            console.log('insert 완료', rows);
            res.send(`<script>
                    alert('회원가입에 성공하셨습니다.');
                    location.href = '/login';
                </script>`);
        });
    });
});

// 로그인
router.post('/login', (req, res) => {
    console.log('login', req.body);
    let { nick, pw } = req.body;

    // 입력 데이터 검증
    if (!nick || !pw) {
        return res.send('<script>alert("아이디와 비밀번호를 입력해주세요."); window.history.back();</script>');
    }

    let sql = 'SELECT USER_NICK, USER_PW FROM KIOSK_USER_TB WHERE USER_NICK = ? AND USER_PW = ?';
    conn.query(sql, [nick, pw], (err, rows) => {
        if (err) {
            console.error(err);
            return res.send('<script>alert("오류가 발생했습니다. 다시 시도해주세요."); window.history.back();</script>');
        }

        console.log('rows', rows);
        if (rows.length > 0) {
            req.session.nick = nick;
            // Check if learning note has been seen
            if (!req.session.learningNoteSeen) {
                res.json({ rows, showLearningNoteModal: true });
            } else {
                res.json({ rows, showLearningNoteModal: false });
            }
        } else {
            res.send('<script>alert("아이디 혹은 비밀번호를 잘못 입력하셨습니다."); window.history.back();</script>');
        }
    });
});

// 로그아웃 여부 확인
router.get('/logout-confirm', (req, res) => {
    res.send(`
        <script>
            if (confirm('로그아웃하시겠습니까?')) {
                window.location.href = '/user/logout';
            } else {
                window.history.back();
            }
        </script>
    `);
});

// 로그아웃 
router.get('/logout', (req, res) => {
    console.log('로그아웃')
    req.session.destroy()
    res.send('<script>localStorage.removeItem("modalShown"); window.location.href="/";</script>');
})

// 회원정보 수정
router.post('/update', (req, res) => {
    console.log('회원정보 수정', req.body);

    let { nick, pw } = req.body;
    let currentNick = req.session.nick;

    // 입력 값 확인
    if (!nick || !pw) {
        return res.send('<script>alert("별명과 비밀번호를 모두 입력해주세요."); window.history.back();</script>');
    }

    let sql = "UPDATE KIOSK_USER_TB SET USER_NICK = ? WHERE USER_NICK = ? AND USER_PW = ?";
    conn.query(sql, [nick, currentNick, pw], (err, result) => {
        if (err) {
            console.error(err);
            return res.send('<script>alert("오류가 발생했습니다. 다시 시도해주세요."); window.history.back();</script>');
        }

        // 변경된 행이 있는 경우
        if (result.affectedRows > 0) {
            // 세션을 종료하여 사용자가 새로운 정보를 보도록 함
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    return res.send('<script>alert("로그아웃 중 오류가 발생했습니다."); window.history.back();</script>');
                }
                // 로그아웃 후 메인페이지로 리디렉션
                res.redirect('/');
            });
        } else {
            res.send(`<script>
                alert("별명 혹은 비밀번호를 다시 입력해주세요.")
                window.location.href="/update"
            </script>`);
        }
    });
});

// 회원탈퇴
router.post('/delete', (req, res) => {
    console.log('delete', req.body);
    let { nick, pw } = req.body;

    if (!nick || !pw) {
        return res.send('<script>alert("별명과 비밀번호를 입력해주세요."); window.history.back();</script>');
    }

    let sql = 'DELETE FROM KIOSK_USER_TB WHERE USER_NICK = ? AND USER_PW = ?';
    conn.query(sql, [nick, pw], (err, result) => {
        if (err) {
            console.error(err);
            return res.send('<script>alert("오류가 발생했습니다. 다시 시도해주세요."); window.history.back();</script>');
        }

        if (result.affectedRows > 0) {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    return res.send('<script>alert("로그아웃 중 오류가 발생했습니다."); window.history.back();</script>');
                }
                res.redirect('/');
            });
        } else {
            res.send('<script>alert("별명이나 비밀번호가 일치하지 않습니다."); window.history.back();</script>');
        }
    });
});

router.get('/session-test', (req, res) => {
    if (req.session.nick) {
        res.send(`로그인된 사용자: ${req.session.nick}`);
    } else {
        res.send('로그인되지 않았습니다.');
    }
});

// 로그인 상태 확인 라우트
router.get('/session-status', (req, res) => {
    if (req.session.nick) {
        res.json({ loggedIn: true, nick: req.session.nick });
    } else {
        res.json({ loggedIn: false });
    }
});

// 모달창 상태 저장 라우트
router.post('/mark-learning-note-seen', (req, res) => {
    if (req.session) {
        req.session.learningNoteSeen = true;
    }
    res.sendStatus(200);
});

module.exports = router;