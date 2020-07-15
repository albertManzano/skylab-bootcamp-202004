const { env: { JWT_SECRET: SECRET } } = process

const { Router } = require('express')
const { registerUser, authenticateUser, retrieveUser, updateUser, retrieveUserBlueprints, createBlueprint, retrieveBlueprint, saveBlueprint } = require('./handlers')
const bodyParser = require('body-parser')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')

const parseBody = bodyParser.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()

api.post('/users', parseBody, registerUser)

api.post('/users/auth', parseBody, authenticateUser)

api.get('/users/:userId?', verifyExtractJwt, retrieveUser)

api.get('/users/update', parseBody, verifyExtractJwt, updateUser)

api.get('/user/blueprints', verifyExtractJwt, retrieveUserBlueprints)

api.get('/blueprint/:blueprintId?', verifyExtractJwt, retrieveBlueprint) //TODO busqueda de usuarios para favPlanes(opcional)

api.post('/blueprint/create', parseBody, verifyExtractJwt, createBlueprint) //PATCH o POST? la logica si no existe lo crea y si existe actualiza... ??

api.patch('/blueprint/save', parseBody, verifyExtractJwt, saveBlueprint) //PATCH o POST? la logica si no existe lo crea y si existe actualiza... ??

module.exports = {
    api
}