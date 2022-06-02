const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const conn = require('../db').promise()
const { getUser } = require('./userController')

const getAllPatients = async (req, res) => {
    try {
        const [rows] = await conn.execute(
            "SELECT * FROM patients",
        )

        if (rows.length > 0){
            rows.forEach(element => {
                console.log(element)
                // res.json({ test:"wleeeh" })
            })
        }
    } catch(err){
        console.log(err)
    }
}

const addPatient = async (req,res, next) => {
    const errors = validationResult(req)
    const userId = req.headers

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        // const userId = await getUser(req.headers)
        const [rows] = await conn.execute('INSERT INTO `patients` (`name`, `nik`, `age`, `gender`, `user_id`) VALUES (?, ?, ?, ?, ?)', [
            req.body.name,
            req.body.nik,
            req.body.age,
            req.body.gender,
            "1"
            // userId
        ])

        if (rows.affectedRows === 1) {
            return res.status(201).json({ message: userId })

        }
    } catch(err) {
        next(err)
    }
}

module.exports = { addPatient, getAllPatients }