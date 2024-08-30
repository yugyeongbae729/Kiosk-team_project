const express = require('express');
const router = express.Router();
const conn = require('../config/db');

router.get('/macBuger', (req, res) => {
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_GROUP = "/BugerImg"';
    conn.execute(sql, (err, rows) =>{
        if(rows.length > 0){
            res.render('MacDeepKio/macBuger', {rows : rows})
            console.log(rows);
        }
    })
})

router.get('/macSide', (req, res) => {
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_GROUP = "/SideImg"';
    conn.execute(sql, (err, rows) =>{
        if(rows.length > 0){
            res.render('MacDeepKio/macSide', {rows : rows})
            console.log(rows);
        }
    })
})

router.get('/macDessert', (req, res) => {
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_GROUP = "/DessertImg"';
    conn.execute(sql, (err, rows) =>{
        if(rows.length > 0){
            res.render('MacDeepKio/macDessert', {rows : rows})
            console.log(rows);
        }
    })
})

router.get('/macBeverage', (req, res) => {
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_GROUP = "/BeverageImg"';
    conn.execute(sql, (err, rows) =>{
        if(rows.length > 0){
            res.render('MacDeepKio/macBeverage', {rows : rows})
            console.log(rows);
        }
    })
})

router.post('/macChoiceS', (req, res) => {
    const {IMG_NAME} = req.body;
    let sql = "SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_NAME LIKE ?";
    conn.execute(sql, [IMG_NAME+'%'], (err, rows) => {
        if(rows.length > 0){
            res.json(rows)
        }
    })
})

router.get('/macSelectS', (req, res) => {
    let sql = "SELECT IMG_GROUP, IMG_PATH, IMG_NAME FROM KIOSK_IMG_TB WHERE IMG_GROUP = '/SideImg'"
    conn.execute(sql, (err, rows) => {
        console.log(rows);
        if(rows.length > 0){
            res.json(rows)
        }
    })
})

router.get('/macSelectB', (req, res) => {
    let sql = "SELECT IMG_GROUP, IMG_PATH, IMG_NAME FROM KIOSK_IMG_TB WHERE IMG_GROUP = '/BeverageImg'"
    conn.execute(sql, (err, rows) => {
        console.log(rows);
        if(rows.length > 0){
            res.json(rows)
        }
    })
})

// 기초 라우터 DB연결 없음
router.get('/macBasicBuger', (req, res) => {
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_GROUP = "/BugerImg"';
    conn.execute(sql, (err, rows) =>{
        if(rows.length > 0){
            res.render('MacBasicKio/macBasicBuger', {rows : rows})
            console.log(rows);
        }
    })
})

router.get('/macBasicSide', (req, res) => {
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_GROUP = "/SideImg"';
    conn.execute(sql, (err, rows) =>{
        if(rows.length > 0){
            res.render('MacBasicKio/macBasicSide', {rows : rows})
            console.log(rows);
        }
    })
})

router.get('/macBasicDessert', (req, res) => {
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_GROUP = "/DessertImg"';
    conn.execute(sql, (err, rows) =>{
        if(rows.length > 0){
            res.render('MacBasicKio/macBasicDessert', {rows : rows})
            console.log(rows);
        }
    })
})

router.get('/macBasicBeverage', (req, res) => {
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_GROUP = "/BeverageImg"';
    conn.execute(sql, (err, rows) =>{
        if(rows.length > 0){
            res.render('MacBasicKio/macBasicBeverage', {rows : rows})
            console.log(rows);
        }
    })
})

router.post('/macBasicChoiceS', (req, res) => {
    const {IMG_NAME} = req.body;
    let sql = "SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_PRICE FROM KIOSK_IMG_TB WHERE IMG_NAME LIKE ?";
    conn.execute(sql, [IMG_NAME+'%'], (err, rows) => {
        if(rows.length > 0){
            res.json(rows)
        }
    })
})

router.get('/macBasicSelectS', (req, res) => {
    let sql = "SELECT IMG_GROUP, IMG_PATH, IMG_NAME FROM KIOSK_IMG_TB WHERE IMG_GROUP = '/SideImg'"
    conn.execute(sql, (err, rows) => {
        if(rows.length > 0){
            res.json(rows)
        }
    })
})

router.get('/macBasicSelectB', (req, res) => {
    let sql = "SELECT IMG_GROUP, IMG_PATH, IMG_NAME FROM KIOSK_IMG_TB WHERE IMG_GROUP = '/BeverageImg'"
    conn.execute(sql, (err, rows) => {
        console.log(rows);
        if(rows.length > 0){
            res.json(rows)
        }
    })
})

module.exports = router;