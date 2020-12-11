//Requirements
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDb= require('./configs/db')
const errorHandler = require('./middleware/errorHandler')


//Application initialization
const app = express()


//Middlewares
app.use(express.json())
app.use(errorHandler)


//Load env vars
dotenv.config({path: './configs/config.env'})
const PORT = process.env.PORT || 3000


connectDb()


// Dev logging middleware
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


//Loading routes files
const urlshorter = require('./routes/urlShort')
//const auth = require('./routes/auth')

//Mounting routes
app.use('/', urlshorter)
//app.use('/auth', auth)

//Static views folder
app.use(express.static(__dirname + "/views"));


//Server start (port 3000)
const server = app.listen(PORT, ()=>{
    console.log(`Server is on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})


//Handle promise rejections
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Unhandled rejection error: ${err.message}`.red);
    //Exit process & close server
    server.close(()=>{process.exit(1)})
})