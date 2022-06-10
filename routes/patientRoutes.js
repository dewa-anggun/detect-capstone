const router = require('express').Router()
const { addPatient, getAllPatients, getCurrentPatient } = require('../controllers/patientController')

router.post('/addPatient', addPatient)
router.get('/getAllPatients', getAllPatients)
router.get('/getCurrentPatient', getCurrentPatient)

module.exports = router