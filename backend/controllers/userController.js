const jwt = require('jsonwebtoken')
const conn = require('../db')

const getUser = async (req,res,next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            return res.status(422).json({ message: "Please provide the token" })
        }

        const loginToken = req.headers.split(' ')[1]
        const decoded = jwt.verify(loginToken, 'detect-token')

        const [row] = await conn.execute(
            "SELECT `id`, `email`, `name` FROM `users` WHERE `id`=?", [decoded.id]
        )

        if (row.length > 0) {
            return res.json({ user:row[0] })
        }

        res.json({ message: "No user found" })
    } catch(err) {
        next(err)
    }
}

module.exports = { getUser }