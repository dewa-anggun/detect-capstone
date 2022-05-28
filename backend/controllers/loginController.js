const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const conn = require('../db').promise()

const login = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        const [row] = await conn.execute(
            "SELECT `email` FROM `users` WHERE `email`=?",
            [req.body.email]
        )

        if (row.length === 0) {
            return res.status(422).json({ message: "Invalid email" })
        }

        const passMatch = await bcrypt.compare(req.body.password, row[0].password)
        if (!passMatch) {
            return res.status(422).json({ message: "Incorrect password" })
        }

        const loginToken = jwt.sign({ id:row[0].id }, 'detect-token', { expiresIn:'1h' })

        return res.json({ token:loginToken })
    } catch(err) {
        next(err)
    }
}

module.exports = { login }