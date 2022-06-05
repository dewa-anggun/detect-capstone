const router = require('express').Router()
const { addPatient, getAllPatients } = require('../controllers/patientController')
const { upload } = require('../controllers/uploadController')

router.post('/addPatient', addPatient)
router.get('/getAllPatients', getAllPatients)
router.post('/upload', (req,res) => {
    upload(req,res, (err) => {
        if (err) {
            res.json({ message: err })
        }
        res.send(req.file)
    })
})

module.exports = router