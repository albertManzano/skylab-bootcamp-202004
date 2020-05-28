require('dotenv').config()

const { PORT, SECRET } = process.env

const express = require('express')
const { registerUser, authenticateUser, retrieveUser, addContact, searchUsers, unregisterUser } = require('./logic')
const { users: { update } } = require("./data")
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')
const jwt = require('jsonwebtoken')
const { JsonWebTokenError } = jwt
const { handleError } = require('./helpers')


const app = express()

const parseBody = bodyParser.json()

// users

app.post('/users', parseBody, (req, res) => {
    const { body: { name, surname, email, password } } = req

    try {
        registerUser(name, surname, email, password, error => {
            if (error) 
                return handleError(error, res)   

            res.status(201).send()
        })
    } catch (error) {
       handleError(error, res)
    }
})

app.post('/users/auth', parseBody, (req, res) => {
    const { body: { email, password } } = req
    debugger
    try {
        authenticateUser(email, password, (error, userId) => {
            if (error) return handleError(error, res)

            const token = jwt.sign({ sub: userId }, SECRET, { expiresIn: '1d' })

            res.send({ token })
        })
    } catch (error) {
        handleError(error, res)

    }
})

app.get('/users/id=:userId?', (req, res) => {

    try {
        const [, token] = req.header('authorization').split(' ')

        let { sub: userId } = jwt.verify(token, SECRET)

        const { params: { userId: _userId } } = req
        if (_userId) {
            userId = _userId
        }
        retrieveUser(userId, (error, user) => {
            if(error) handleError(error, res)

            res.send(user)
        })
    } catch (error) {
        handleError(error, res)

    }

})


app.get('/users/q=:query?', (req, res) => {

    try {
        const [, token] = req.header('authorization').split(' ')

        const { sub: userId } = jwt.verify(token, SECRET)

        const { params: { query } } = req

        searchUsers(userId, query, (error, users) => {
            if (error) return res.status(400).json({ error: error.message })

            res.send(users)
        })
    } catch (error) {
        if (error instanceof JsonWebTokenError) res.status(401)

        else  res.status(406).json({ error: error.message })
    }
})

app.delete('/users/delete', parseBody, (req, res) => {
    debugger
    try {
        const [, token] = req.header('authorization').split(' ')

        const { sub: userId } = jwt.verify(token, SECRET)

        const { body: { email, password } } = req
        unregisterUser(email, password, userId, (error) => {
            if (error) return res.status(403).json({ error: error.message })
            res.status(204).send()
        })
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401).send()
        else
            res.status(406).json({ error: error.message })
    }
})

app.patch('/users/update', parseBody, (req, res) => {
    debugger
    try {
        const [, token] = req.header('authorization').split(' ')

        const { sub: userId } = jwt.verify(token, SECRET)

        const { body } = req

        update(userId, body, error => {
            if (error) return res.status(403).json( { error: error.message } )
            res.json({ "message": "user updated" } )  //TODO
        })

    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401).send()
        else
            res.status(406).json({ error: error.message })
    }
})

// contacts

app.post('/contacts', parseBody, (req, res) => {
    try {
        const [, token] = req.header('authorization').split(' ')

        const { sub: userId } = jwt.verify(token, SECRET)

        const { body: contact } = req

        addContact(userId, contact, (error, contactId) => {
            if (error) return res.status(401).json({ error: error.message })

            res.send({ contactId })
        })
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401).send()
        else
            res.status(406).json({ error: error.message })
    }
})

app.get('/contacts/:contactId', (req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve contact by contact id param and send it back
})

// other

app.get('*', (req, res) => {
    res.status(404).send('Not Found :(')
})

app.listen(8080, () => console.log(`${name} ${version} running in ${PORT}`))