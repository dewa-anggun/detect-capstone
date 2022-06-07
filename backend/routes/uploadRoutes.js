const router = require('express').Router()
const Multer = require('multer')
const path = require('path')
const conn = require('../db').promise()

const storage = Multer.diskStorage({
    destination(req,file,cb) {
        cb(null, 'uploads/') 
    },
    filename(req,file,cb) {
        cb(null, `ct_image_${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileTypes(file, cb) {
    const fileTypes = /jpg|jpeg|png/
    const fileExt = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimeType)

    if (fileExt && mimeType) {
        return cb(null, true)
    } else {
        cb("Image only")
    }
}

const upload = Multer({
    storage,
    // fileFilter: function (req, file, cb) {
    //     checkFileTypes(file, cb)
    // }
})

router.post('/', upload.single("file"), async (req, res) => {
    try{
        const [row] = await conn.execute(
            "SELECT `id` FROM `patients`"
        )

        if (row.length > 0) {
            const [rows] = await conn.execute("UPDATE `patients` SET `ct_image`=? WHERE `id` =?", [
                `/uploads/${req.file.filename}`,
                row[row.length-1].id
            ])
            if (rows.affectedRows === 1) {
                // return res.status(201).json({ message: "Patient added successfully" })
            }
        }
        // console.log(ct_image)
        res.send(`/${req.file.path.replace('\\', '/')}`)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router