const conn = require('../db').promise()
const tf = require('@tensorflow/tfjs-node')
const sharp = require('sharp')

const predictCovid = async (req,res,next) => {
    try {
        const [row] = await conn.execute(
            "SELECT `id` FROM `patients`"
        )
    
        let [image_predict] = await conn.execute("SELECT `ct_image` FROM `patients` WHERE `id`=?", [row[row.length-1].id])
            let image_predict2 = null
            const MODEL_URI = 'file://localhost/Model/TFjs_Model/model.json'
            const model1 = await tfjs.loadLayersModel(MODEL_URI);
    
            sharp(image_predict).resize({ height: 160, width: 160 }).toFile(image_predict2)
                .then(function(newFileInfo) {
                    console.log("success")
            })
    
            const result1 = model1.predict(image_predict)
            res.json({ image:image_predict })
            console.log(image_predict)
    } catch (err){
        res.send(err)
    }
}

module.exports = { predictCovid }