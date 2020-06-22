require('termometro-commons/polyfills/string')
require('termometro-commons/polyfills/json')
const { utils: {Email}} = require('termometro-commons')
const { mongoose: { ObjectId }, models: { User } } = require('termometro-data')
// const bcrypt = require('bcryptjs')
const {UnexistenceError} = require('termometro-commons/errors')

module.exports = (userId, data) => {

    String.validate.notVoid(userId)

    return (async() => {
        const user = await User.findById(userId);
        if (!user) throw new UnexistenceError('El usuario que quieres actualizar no existe');

        let updateData = {}

        for (const keys in data) {
            updateData[keys] = data[keys];
        }

        await User.findByIdAndUpdate(userId, updateData);

        return
    })()
}