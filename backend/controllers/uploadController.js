const Multer = require('multer')
const path = require('path')
const conn = require('../db').promise()

let storage = Multer.diskStorage({
    destination(req,file,cb) {
        cb(null, 'uploads/') 
    },
    filename(req,file,cb) {
        cb(null, `${file.originalName}-${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = async (req, res) => {
    const [row] = await conn.execute(
        "SELECT `id` FROM `patients`"
    )

    let ct_image = null
    let uploads = Multer({ storage: storage }).single("file");
    uploads(req,res, (err) => {
                if (err) {
                    res.json({ message: err })
                }
                ct_image = `/uploads/${req.file.filename}`
                res.json({ message: ct_image })
    })
    // if (row.length > 0) {
    //     const [rows] = await conn.execute("UPDATE `patients` SET `ct_image`=? WHERE `id` =?", [
    //         "ct_image",
    //         row[row.length]
    //     ])
    // }
}

module.exports = { upload }