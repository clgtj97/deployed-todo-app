const Pool = require('pg').Pool
// import pg from modules
require('dotenv').config()
// require dotenv to pull sensetive information with out kinsta being in the middel

const pool = new Pool({
    user: process.env.USERNAME,
    // process.env pulls data from .env file
    password: process.env.PASSWORD,
    // password in a secret file
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'todoapp'
})
// how where comunication with postgress

module.exports = pool