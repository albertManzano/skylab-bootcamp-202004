require('dotenv').config()

const { argv: [, , PORT_CLI], env: { PORT: PORT_ENV, SECRET, MONGODB_URL } } = process
const PORT = PORT_CLI || PORT_ENV || 8080

const path = require('path')
const { Logger, singletonFileLogger, singletonConsoleLogger } = require('./logger')
const file = singletonFileLogger(path.join(__dirname, 'server.log'))
const console = singletonConsoleLogger()
file.level = Logger.WARN
console.level = Logger.DEBUG

const express = require('express')
const { registerUser, authenticateUser, retrieveUser } = require('books-server-logic')
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')
const { handleError } = require('./helpers')
const { utils: { jwtPromised } } = require('books-commons')
const { jwtVerifierExtractor, cors } = require('./middleware')
const { mongoose } = require('books-data')

console.debug('starting server')

try {
    console.debug('connecting to database')

    mongoose.connect(MONGODB_URL)
        .then(() => {
            console.info(`connected to database ${MONGODB_URL}`)

            const app = express()

            const parseBody = bodyParser.json()

            const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

            app.use(cors)

            // users

            app.post('/register', parseBody, (req, res) => {
                const { body: { name, surname, email, password } } = req

                try {
                    registerUser(name, surname, email, password)
                        .then(() => res.status(201).send())
                        .catch(error => handleError(error, res))
                } catch (error) {
                    handleError(error, res)
                }
            })

            app.post('/authenticate', parseBody, (req, res) => {
                const { body: { email, password } } = req

                try {
                    authenticateUser(email, password)
                        .then(userId => jwtPromised.sign({ sub: userId }, SECRET, { expiresIn: '1d' }))
                        .then(token => res.send({ token }))
                        .catch(error => handleError(error, res))
                } catch (error) {
                    handleError(error, res)
                }
            })

            app.get('/retrieve', verifyExtractJwt, (req, res) => {
                try {
                    const { payload: { sub: userId }, params: { userId: otherUserId } } = req

                    retrieveUser(otherUserId || userId)
                        .then(user => res.send(user))
                        .catch(error => handleError(error, res))
                } catch (error) {
                    handleError(error, res)
                }
            })



            app.get('*', (req, res) => {
                res.status(404).send('Not Found :(')
            })

            app.listen(PORT, () => console.info(`server ${name} ${version} running on port ${PORT}`))

            let interrupted = false

            process.on('SIGINT', () => {
                if (!interrupted) {
                    interrupted = true

                    console.debug('stopping server')

                    console.debug('disconnecting database')

                    mongoose.disconnect()
                        .then(() => console.info('disconnected database'))
                        .catch(error => file.error('could not disconnect from mongo', error))
                        .finally(() => {
                            console.info(`server ${name} ${version} stopped`)

                            setTimeout(() => {
                                file.close()

                                setTimeout(() => {
                                    process.exit()
                                }, 500)
                            }, 500)
                        })
                }
            })
        })
        .catch(error => {
            file.error('could not connect to mongo', error)
        })
} catch (error) {
    file.error(error)
}