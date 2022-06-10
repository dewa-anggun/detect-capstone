const mysql = require('mysql2')

const dbConnect = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}).on("error", (err) => {
    console.log("Database connection failed", err)
})

module.exports = dbConnect