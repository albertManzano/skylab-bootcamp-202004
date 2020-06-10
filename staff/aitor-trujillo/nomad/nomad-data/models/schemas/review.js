const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    }, // userId
    stars: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})