const express = require('express')
const morgan = require('morgan')
const server = express()
//const path = require('path')
//const cors = require('cors')

// server.use(cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["my-custom-header"],
//     credentials: true
// }))
server.use(morgan('dev'))
server.use(express.json())

//server.use(express.static(path.join(__dirname,'public')))

server.use('/',require('./routes'))

module.exports = server