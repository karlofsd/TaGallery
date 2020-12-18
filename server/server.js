const express = require('express')
const morgan = require('morgan')
const server = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tagallery',{
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(()=> console.log('db conected'))
    .catch((err)=> console.log(err))

/* server.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST","PUT","DELETE"],
    allowedHeaders: ["content-type","application"],
    credentials: true
})) */

server.use(cors())
server.use(morgan('dev'))
server.use(express.json())

server.use('/',require('./routes'))

module.exports = server