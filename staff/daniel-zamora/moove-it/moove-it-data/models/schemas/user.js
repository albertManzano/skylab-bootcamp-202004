const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true

    },

    password: {
        type: String,
        required: true
    },

    blueprints: [{
        type: ObjectId,
        ref: 'Blueprint'
    }],

    // favPlanes: {
    //     type: [ObjectId], 
    //     ref: 'Blueprint'
    // }
})