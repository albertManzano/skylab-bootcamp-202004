const { env: { SECRET } } = process

const { Router } = require('express')

const { 
    registerEstablishment, 
    authenticate, 
    retrieveWorker, 
    registerWorker, 
    addDish, 
    retrieveDishes, 
    retrieveEstablishment, 
    assignNumOfTables, 
    toggleTableOrder,
    addDishesToOrder,
    retrieveTables
} = require('./handlers')

const bodyParser = require('body-parser')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')

const parseBody = bodyParser.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()
debugger


api.post('/establishment', parseBody, registerEstablishment)
api.post('/user/auth', parseBody, authenticate)
api.get('/worker', verifyExtractJwt, retrieveWorker)
api.post('/worker', parseBody, verifyExtractJwt, registerWorker)
api.post('/dishes', parseBody, verifyExtractJwt, addDish)
api.get('/dishes', verifyExtractJwt, retrieveDishes)
api.get('/establishment', verifyExtractJwt, retrieveEstablishment)
api.post('/qtytables', parseBody, verifyExtractJwt, assignNumOfTables)
api.post('/open', parseBody, verifyExtractJwt, toggleTableOrder)
api.post('/establishment/:establishmentId/table/:tableId', parseBody, addDishesToOrder)
api.get('/tables', verifyExtractJwt, retrieveTables)

module.exports = {
    api
}