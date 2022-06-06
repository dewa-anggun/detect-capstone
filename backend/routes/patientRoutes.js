const router = require('express').Router()
const { addPatient, getAllPatients } = require('../controllers/patientController')
const { upload } = require('../controllers/uploadController')

router.post('/addPatient', addPatient)
router.get('/getAllPatients', getAllPatients)
router.post('/upload', upload)

module.exports = router