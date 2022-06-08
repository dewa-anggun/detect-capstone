const mysql = require('mysql2')

const dbConnect = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "detect-capstone"
}).on("error", (err) => {
    console.log("Database connection failed", err)
})

module.exports = dbConnect