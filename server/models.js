const {Schema,model} = require('mongoose')

const tags = new Schema({
    name:{type: String, required:true},
    color:{type: String}
})

module.exports = model('Tags',tags)