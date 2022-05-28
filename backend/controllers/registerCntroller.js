const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const conn = require('../db').promise()

const register = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        const [row] = await conn.execute(
            "SELECT `email` FROM `users` WHERE `email`=?",
            [req.body.email]
        )

        if (row.length > 0) {
            return res.status(201).json({ message: "Email is already in use" })
        }

        const hashPass = await bcrypt.hash(req.body.password, 12)
        const [rows] = await conn.execute('INSERT INTO `users` (`email`, `name`, `password`) VALUES (?, ?, ?)', [
            req.body.email,
            req.body.name,
            hashPass
        ])

        if (rows.affectedRows === 1) {
            return res.status(201).json({ message: "The user has been successfully inserted" })
        }
    } catch(err) {
        next(err)
    }
}

module.exports = { register }