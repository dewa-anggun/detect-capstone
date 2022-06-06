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
    let ct_image = "low"
    let uploads = Multer({ storage: storage }).single("file");
    uploads(req,res, (err) => {
                if (err) {
                    res.json({ message: err })
                }
                ct_image = `/uploads/${req.file.filename}`
                res.json({ message: ct_image })
    })
    try{
        const [row] = await conn.execute(
            "SELECT `id` FROM `patients`"
        )

        if (row.length > 0) {
                const [rows] = await conn.execute("UPDATE `patients` SET `ct_image`=? WHERE `id` =?", [
                    ct_image,
                    row[row.length-1].id
                ])
                if (rows.affectedRows === 1) {
                    // return res.status(201).json({ message: "Patient added successfully" })
                }
            }
    } catch (err) {
        console.log(err)
    }
}

module.exports = { upload }