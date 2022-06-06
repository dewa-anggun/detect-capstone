const express = require('express')
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
const patientRoutes = require('./routes/patientRoutes')
const cors = require('cors')
dotenv.config()
const App = express()

App.use(express.json())
App.use('/user', userRoutes)
App.use('/patient', patientRoutes)

App.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`))