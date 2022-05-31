const express = require('express')
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
dotenv.config()
const App = express()

App.use(express.json())
App.use('/user', userRoutes)

App.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`))