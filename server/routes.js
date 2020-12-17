const express = require('express')
const router = express.Router()

router.get('/', async(req,res) => {
    console.log('run server')
    res.send('hello')
})

module.exports = router