const jwt = require('jsonwebtoken')
const conn = require('../db')

function getUserId(id){
    try {

        const loginToken = id.split(' ')[1]
        const decoded = jwt.verify(loginToken, 'detect-token')

        const [row] = conn.execute(
            "SELECT `id`, `email`, `name` FROM `users` WHERE `id`=?", [decoded.id]
        )

        if (row.length > 0) {
            return res.json({ user:row[0] })
        }

        res.json({ message: "No user found" })
    } catch(err) {
        console.log(err)
    }
}

module.exports = { getUserId }