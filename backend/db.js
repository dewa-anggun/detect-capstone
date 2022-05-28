const mysql = require('mysql2')

const dbConnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "detect-capstone"
}).on("error", (err) => {
    console.log("Database connection failed", err)
})

module.exports = dbConnect