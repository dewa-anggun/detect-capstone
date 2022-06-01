const router = require('express').Router()
const { addPatient, getAllPatients } = require('../controllers/patientController')

router.post('/addPatient', addPatient)
router.get('/getAllPatients', getAllPatients)

module.exports = router