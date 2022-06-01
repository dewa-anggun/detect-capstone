const router = require('express').Router()
const { addPatient } = require('../controllers/patientController')

router.post('/addPatient', addPatient)

module.exports = router