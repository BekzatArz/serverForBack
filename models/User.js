const { Schema, model, ObjectId } = require('mongoose')

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    files: [{type: ObjectId, ref: 'File'}]

})

module.exports = model('User', User)