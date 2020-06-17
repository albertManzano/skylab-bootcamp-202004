require('dotenv').config()
const { argv: [ , , PORT_CLI], env: {PORT: PORT_ENV, JWT_SECRET, MONGODB_URL} } = process
const PORT = PORT_CLI || PORT_ENV || 8080

const express = require ('express')
const { registerUser, authenticateUser, createRestaurant, createMenu, searchPlate, searchRestaurant } = require('plates-server-logic')
const bodyParser = require('body-parser')
const { handleError } = require('./helpers')
const { utils: {  jwtPromised }} = require('plates-commons')
const { jwtVerifierExtractor, cors } = require('./middlewares')
const { name, version } = require('./package.json')
const { mongoose }  = require('plates-data')

mongoose.connect(MONGODB_URL)
    .then(()=>{
        console.log(`Connected to ${MONGODB_URL}`)

        const app = express()

        const parseBody = bodyParser()

        const verifyExtractJwt =  jwtVerifierExtractor(JWT_SECRET, handleError)

        app.use(cors) 


        app.post('/users', parseBody, (req, res) =>{
            
            const { body: { name, surname, email, password }} = req

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

        app.post('/users/restaurant', verifyExtractJwt, parseBody, (req, res) => {

            const {payload: { sub: userId}, body: { name, email, cif, address, phone } } = req
            
            try {
                createRestaurant(userId, name, email, cif, address, phone)    
                .then(()=> res.status(201).end()) 
                .catch(error => handleError(error, res))             
            } catch (error) {
                handleError(error, res)
            }
        })

        app.post('/restaurant/menu', verifyExtractJwt, parseBody, (req, res) => {
            const { payload: { sub: userId }, body: { restaurantId, dishesIds }}   = req

            try {
                createMenu(userId, restaurantId, dishesIds)  
                    .then(() => res.status(201).end())
                    .catch(error => handleError(error, res))                  
            } catch (error) {
                handleError(error, res)
            }
        })

        app.get('/:dishes?', (req, res) => {
            const { params: {dishes} }   = req
            
            try {
                searchPlate(dishes)
                    .then((dish) => res.status(200).json(dish))
                    .catch(error => handleError(error, res))
            } catch (error) {
                handleError(error, res)               
            }
        })

        app.get('/search/:restaurant?', (req, res) => {
            const { params: { restaurant } } = req

            try {
                searchRestaurant(restaurant)
                    .then((restaurants) => res.status(200).json(restaurants))
                    .catch(error => handleError(error, res))
            } catch (error) {
                handleError(error, res)
            }
        })

        app.listen(PORT, () => console.log(`${name} ${version} running on port ${PORT}`))

        process.on('SIGINT', () => {
            mongoose.disconnect()
                .then(() => console.log('\ndisconnected mongo'))
                .catch(error => console.error('could not disconnect from mongo', error))
                .finally(() => {
                    console.log(`${name} ${version} stopped`)

                    process.exit()
                })
        })

    })

    .catch(error => {
        console.error('Unable to connect mongo', error)
    })