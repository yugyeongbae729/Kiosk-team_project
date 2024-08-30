const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
    host : process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_USER,
    password: process.env.DB_PW,
    user : process.env.DB_USER
});

conn.connect();

console.log("DB연결 완료");

module.exports = conn;