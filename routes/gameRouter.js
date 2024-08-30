const express = require('express')
const router = express.Router()
const conn = require('../config/db')

router.get('/data', (req, res)=>{
    let sql = 'SELECT IMG_GROUP, IMG_PATH, IMG_NAME, IMG_INFO FROM KIOSK_IMG_TB ORDER BY RAND() LIMIT 5';
    conn.execute(sql, (err,rows) => {
        if(rows.length > 0 ){
            res.json(rows)
        }else{
            res.redirect('/')
        }
        console.log(rows);
    })
})

module.exports = router;