const express = require('express')
const router = express.Router()
const Tags = require('./models')

router.get('/', async(req,res) => {
    try{
        let {page,limit} = req.query
        const countTags = await Tags.countDocuments()
        const tags = await Tags.find({},'name color').skip(Number(page*limit)).limit(Number(limit)).sort({_id:'desc'})
        console.log(tags)
        res.status(200).json({counter: countTags, tags: tags})
    } catch(err){
        res.status(404).json(err)
    }
})

router.post('/create',async(req,res) => {
    try{
        let body = req.body
        console.log(body)
        const tag = new Tags(body)
        tag.save()
        res.status(201).send('Tag creada exitosamente')
    } catch(err){
        res.status(400).json(err)
    }
})

router.put('/update/:id', async(req,res) => {
    try{
        let {id} = req.params
        let body = req.body
        await Tags.findByIdAndUpdate(id,body)
        res.status(200).send('Tag actualizada')
    } catch(err){
        res.status(404).json({message:'error al actualizar', err})
    }
})

router.delete('/delete/:id', async(req,res) => {
    try{
        let {id} = req.params
        await Tags.findByIdAndRemove(id)
        res.status(200).send('Tag eliminada')
    } catch(err){
        res.status(400).json(err)
    }
})

module.exports = router