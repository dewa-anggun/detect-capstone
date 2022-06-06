const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const conn = require('../db').promise()

const getAllPatients = async (req, res) => {
    const errors = validationResult(req)
    let userId = req.headers.authorization

    if (!userId || !userId.startsWith('Bearer') || !userId.split(' ')[1]) {
        return res.status(422).json({ message: "Please provide the token" })
    }

    const loginToken = userId.split(' ')[1]
    const decoded = jwt.verify(loginToken, 'detect-token')

    let [row] = await conn.execute(
        "SELECT `id`, `email`, `name` FROM `users` WHERE `id`=?", [decoded.id]
    )

    if (row.length > 0) {
        userId = row[0].id
    }
    try {
        const [rows] = await conn.execute(
            "SELECT * FROM patients WHERE `user_id`=?", [userId]
        )

        if (rows.length > 0){
            res.json({ patients:rows })
        }
    } catch(err){
        console.log(err)
    }
}

const addPatient = async (req,res, next) => {
    const added = new Date().toISOString()
    const errors = validationResult(req)
    let userId = req.headers.authorization

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        if (!userId || !userId.startsWith('Bearer') || !userId.split(' ')[1]) {
            return res.status(422).json({ message: "Please provide the token" })
        }

        const loginToken = userId.split(' ')[1]
        const decoded = jwt.verify(loginToken, 'detect-token')

        const [row] = await conn.execute(
            "SELECT `id`, `email`, `name` FROM `users` WHERE `id`=?", [decoded.id]
        )

        if (row.length > 0) {
            userId = row[0].id
        }

        const [rows] = await conn.execute('INSERT INTO `patients` (`name`, `nik`, `age`, `gender`, `date_added`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)', [
            req.body.name,
            req.body.nik,
            req.body.age,
            req.body.gender,
            added,
            userId
        ])

        if (rows.affectedRows === 1) {
            return res.status(201).json({ message: "Patient added successfully" })
        }
    } catch(err) {
        next(err)
    }
}

module.exports = { addPatient, getAllPatients }