const Multer = require('multer');
const upload = Multer({dest:'../uploads/'}).single("file");

module.exports = { upload }