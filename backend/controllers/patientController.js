const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const conn = require('../db').promise()
// const { getUser } = require('./userController')

const addPatient = async (req,res,next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        // const userId = await getUser()
        const [rows] = await conn.execute('INSERT INTO `patients` (`name`, `nik`, `age`, `gender`, `user_id`) VALUES (?, ?, ?, ?, ?)', [
            req.body.name,
            req.body.nik,
            req.body.age,
            req.body.gender,
            "1"
        ])

        if (rows.affectedRows === 1) {
            return res.status(201).json({ message: "Patient record has been successfully inserted" })
        }
    } catch(err) {
        next(err)
    }
}

module.exports = { addPatient }