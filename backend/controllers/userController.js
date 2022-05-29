const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
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

const login = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        const [row] = await conn.execute(
            "SELECT * FROM `users` WHERE `email`=?",
            [req.body.email]
        )

        if (row.length === 0) {
            return res.status(422).json({ message: "Invalid email" })
        }

        const passMatch = await bcrypt.compare(req.body.password, row[0].password)
        if (!passMatch) {
            return res.status(422).json({ message: "Incorrect password" })
        }

        const loginToken = jwt.sign({ id:row[0].id }, 'detect-token', { expiresIn:'1d' })

        return res.json({ token:loginToken })
    } catch(err) {
        next(err)
    }
}

const getUser = async (req,res,next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            return res.status(422).json({ message: "Please provide the token" })
        }

        const loginToken = req.headers.authorization.split(' ')[1]
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

module.exports = { register, login, getUser }