const router = require('express').Router()
const { body } = require('express-validator')
const { register } = require('./controllers/registerCntroller')
const { login } = require('./controllers/loginController')
const { getUser } = require('./controllers/userController')

router.post('/register', [
    body('email', "Invalid email address")
    .notEmpty()
    .escape()
    .trim()
    .isEmail(),
    body('name', "Name cannot be empty")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 1 }),
    body('password', "Password must atleast be 8 characters long")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
], register)

router.post('/login', [
    body('email', "Invalid email address")
    .notEmpty()
    .escape()
    .trim()
    .isEmail(),
    body('password', "Password must atleast be 8 characters long")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
], login)

router.get('/getUser', getUser)

module.exports = router