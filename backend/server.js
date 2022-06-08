const express = require('express')
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
const patientRoutes = require('./routes/patientRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const path = require('path')
const router = require('./routes/userRoutes')
dotenv.config()
const App = express()

App.use(express.json())

//use routes
App.use('/user', userRoutes)
App.use('/patient', patientRoutes)
App.use('/upload', uploadRoutes)

App.use('/uploads', express.static(path.join(__dirname, '/uploads')))


App.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`))