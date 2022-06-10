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
    const decoded = jwt.verify(loginToken, process.env.JWT_TOKEN)

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

const getCurrentPatient = async (req, res, next) => {
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
        const decoded = jwt.verify(loginToken, process.env.JWT_TOKEN)

        const [query1] = await conn.execute(
            "SELECT `id`, `email`, `name` FROM `users` WHERE `id`=?", [decoded.id]
        )

        if (query1.length > 0) {
            userId = query1[0].id
        }

        const [query2] = await conn.execute(
            "SELECT * FROM `patients` WHERE `user_id`=?",[
                userId
            ]
        )

        if (query2.length > 0) {
            const [rows] = await conn.execute("SELECT * FROM `patients` WHERE `id`=?", [
                query2[query2.length-1].id
            ])

            res.json({ patient:rows})
        }
    } catch(err) {
        next(err)
    }
}

const addPatient = async (req,res, next) => {
    const added = new Date()
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
        const decoded = jwt.verify(loginToken, process.env.JWT_TOKEN)

        const [row] = await conn.execute(
            "SELECT `id`, `email`, `name` FROM `users` WHERE `id`=?", [decoded.id]
        )

        if (row.length > 0) {
            userId = row[0].id
        }

        const [rows] = await conn.execute('INSERT INTO `patients` (`name`, `nik`, `age`, `gender`, `address`, `date_added`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            req.body.name,
            req.body.nik,
            req.body.age,
            req.body.gender,
            req.body.address,
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

module.exports = { addPatient, getAllPatients, getCurrentPatient }