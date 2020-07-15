require('dotenv').config()

const { argv: [, , PORT_CLI], env: { PORT: PORT_ENV, JWT_SECRET, MONGODB_URL } } = process
const PORT = PORT_CLI || PORT_ENV || 8080

const express = require('express')
const { registerUser, authenticateUser, retrieveUser, updateCart, unregisterUser } = require('misc-server-logic')
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')
const { handleError } = require('./helpers')
const { utils : {jwtPromised} } = require('misc-commons')
const { jwtVerifierExtractor, cors } = require('./middlewares')

const { mongoose } = require('misc-data')

mongoose.connect(MONGODB_URL)
    .then(connection => {
        console.log('connected to mongo')

        const app = express()

        const parseBody = bodyParser.json()

        const verifyExtractJwt = jwtVerifierExtractor(JWT_SECRET, handleError)

        // users
        app.use(cors)
        app.post('/users', parseBody, (req, res) => {
            const { body: { name, surname, email, password } } = req

            try {
                registerUser(name, surname, email, password)
                    .then(() => res.status(201).send())
                    .catch(error => handleError(error, res))
            } catch (error) {
                handleError(error, res)
            }
        })

        app.post('/users/auth', parseBody, (req, res) => {
            const { body: { email, password } } = req

            try {
                authenticateUser(email, password)
                    .then(userId => jwtPromised.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1d' }))
                    .then(token => res.send({ token }))
                    .catch(error => handleError(error, res))
            } catch (error) {
                handleError(error, res)
            }
        })

        app.get('/users/:userId?', verifyExtractJwt, (req, res) => {
            try {
                const { payload: { sub: userId }, params: { userId: otherUserId } } = req
                retrieveUser(otherUserId || userId)
                    .then(user => res.send(user))
                    .catch(error => handleError(error, res))
            } catch (error) {
                handleError(error, res)
            }
        })

        app.delete('/users/unregister', verifyExtractJwt, parseBody, (req, res)=>{
            try {
                const { payload: { sub: userId }, body: { email, password }} = req
                unregisterUser(userId, email, password)
                .then((response) => res.send(response))
                .catch(error => handleError(error, res))
                
            } catch (error) {
                handleError(error, res)
            }
        })

        app.post('/updateCart/', parseBody,(req, res) => {
            try {
                const { body: { userId, productId, quantity} } = req
                updateCart(userId, productId, quantity )
                .then(()=> res.status(201).send())
                .catch(error => handleError(error, res))
            
            } catch (error) {
               handleError(error, res) 
            }
        })

        app.post('/orders', verifyExtractJwt, (req, res) => {
            try {
                const {payload: {sub: userId} } = req
                placeOrder(userId)
                    .then(()=> res.status(201).send("Your order has been placed"))
                    .catch(error => handleError(error, res))                    
            } catch (error) {
                handleError(error, res)
            }
        })
        
        app.get('*', (req, res) => {
            res.status(404).send('Not Found :(')
        })

        app.listen(PORT, () => console.log(`${name} ${version} running on port ${PORT}`))

        process.on('SIGINT', () => {
            connection.close()
                .then(() => console.log('\ndisconnected mongo'))
                .catch(error => console.error('could not disconnect from mongo', error))
                .finally(() => {
                    console.log(`${name} ${version} stopped`)

                    process.exit()
                })
        })
    })
    .catch(error => {
        console.error('could not connect to mongo', error)
    })