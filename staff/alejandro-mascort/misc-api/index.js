require('dotenv').config()

const { PORT, SECRET } = process.env

const express = require('express')
const { registerUser, authenticateUser, retrieveUser, addContact, searchContacts, listContacts, addStickie, searchStickies, listStickies, removeContact, removeStickies } = require('./logic')
const parseToken = require('./helpers/middlewares/token')
const { find } = require('./data')
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')
const jwt = require('jsonwebtoken')

const { JsonWebTokenError } = jwt

const app = express()

const parseBody = bodyParser.json()

// users

app.post('/users', parseBody, (req, res) => {
    const { body } = req

    try {
        registerUser(body, error => {
            if (error) return res.status(409).json({ error: error.message })

            res.status(201).send()
        })
    } catch (error) {
        res.status(406).json({ error: error.message })
    }
})

app.get('/users', parseToken, (req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve user and send it back
    // TODO if userId is received as a param, the retrieve that user instead of requester user
    const {sub: userId, token} = req

    try {
        retrieveUser(userId, (error, userFound)=>{
            if (error) return res.status(404).json({error: error.message})

            res.send(userFound)
        })
            
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }
})

app.post('/users/auth', parseBody, (req, res) => {
    const { body } = req

    try {
        authenticateUser(body, (error, userId) => {
            if (error) return res.status(401).json({ error: error.message })

            const token = jwt.sign({sub:userId}, SECRET, {expiresIn: '1d'})

            res.send({ token })
        })
    } catch (error) {
        res.status(406).json({ error: error.message })
    }
})

app.get('/users/:id', parseToken, (req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve user and send it back
    // TODO if userId is received as a param, the retrieve that user instead of requester user
    const {sub: userId, token} = req
    const { id } = req.params

    try {

        find({id: userId}, 'users', (error, [user]) => {
            if (error) return res.status(401).json({error: error.message})

            if (!user) return res.status(406).json({error: 'user not authorized'})

            retrieveUser(id, (error, userFound)=>{
                if (error) return res.status(404).json({error: error.message})
    
                res.send(userFound)
            })
            
        }) 
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }
})


// contacts

app.post('/contacts', parseBody, parseToken, (req, res) => {
    const {sub: userId, body} = req

    try {
        addContact(userId, body, (error, contactId) => {
            if (error) return res.status(401).json({ error: error.message })

            res.status(201).send({ contactId })
        })
    } catch (error) {
        res.status(406).json({ error: error.message })
    }
})

app.get('/contacts', parseToken, (req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve contact by contact id param and send it back
    const {sub: userId} = req

    try{
        listContacts(userId, (error, contacts)=>{
            if (error) return res.status(401).json({error: error.message})

            res.send(contacts)
        })
                
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }

})

app.get('/contacts/:contactId', parseToken, (req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve contact by contact id param and send it back
    const {sub: userId} = req

    const { contactId } = req.params

    try{
        find({id: userId}, 'users', (error, [user]) => {
            if (error) return res.status(404).json({error: error.message})

            if (user) {
                    find({contactId}, 'contacts', (error, [contactFound])=>{
                        if (error) return res.status(401).json({error: error.message})

                        if (!contactFound) return res.status(404).json({error: "No contact found"})
            
                        res.send(contactFound)
                    })
                
            } else res.status(401).json({error: 'user not authorized'})
        }) 
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }

})

app.get('/contacts/search/q=:query', parseToken,(req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve contact by contact id param and send it back
    const {sub: userId} = req

    const { query } = req.params

    try {
        searchContacts(userId, query, (error, results)=>{
            if (error) return res.status(401).json({error: error.message})

            if (!results) return res.status(404).json({error: "No contacts found"})

            res.send(results)

        })
       
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }

})

app.patch('/contacts', parseBody, parseToken,(req, res) => {
    const {sub: userId, body} = req

    try {
        removeContact(userId, body.contactId, (error, message)=>{
            if (error) return res.status(401).json({error: error.message})

            res.status(204).send()
        })
       
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }

})

// stickie

app.get('/stickies', parseToken, (req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve contact by contact id param and send it back
    const {sub: userId} = req

    try{
        listStickies(userId, (error, stickies)=>{
            if (error) return res.status(401).json({error: error.message})

            res.send(stickies)
        })
                
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }

})

app.post('/stickies', parseBody, parseToken, (req, res) => {
    const {sub: userId, body} = req

    try {
        addStickie(userId, body, (error, stickieId) => {
            if (error) return res.status(401).json({ error: error.message })

            res.status(201).send({ stickieId })
        })
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }
})

app.get('/stickies/:stickieId', parseToken, (req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve contact by contact id param and send it back
    const {sub: userId} = req

    const { stickieId } = req.params

    try{
        find({id: userId}, 'users', (error, [user]) => {
            if (error) return res.status(404).json({error: error.message})

            if (user) {
                    find({stickieId}, 'stickies', (error, [stickieFound])=>{
                        if (error) return res.status(401).json({error: error.message})

                        if (!stickieFound) return res.status(404).json({error: "No contact found"})
            
                        res.send(stickieFound)
                    })
                
            } else res.status(401).json({error: 'user not authorized'})
        }) 
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }

})

app.get('/stickies/search/q=:query', parseToken,(req, res) => {
    // TODO extract userId from authorization (bearer token) then retrieve contact by contact id param and send it back
    const {sub: userId} = req

    const { query } = req.params

    try {
        searchStickies(userId, query, (error, results)=>{
            if (error) return res.status(401).json({error: error.message})

            if (!results) return res.status(404).json({error: "No stickies found"})

            res.send(results)

        })
       
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }

})

app.patch('/stickies', parseBody, parseToken,(req, res) => {
    const {sub: userId, body} = req

    try {
        removeStickies(userId, body.stickieId, (error, message)=>{
            if (error) return res.status(401).json({error: error.message})

            res.status(204).send()
        })
       
    } catch (error) {
        if (error instanceof JsonWebTokenError)
            res.status(401)
        else
            res.status(406)

        res.json({error: error.message})
    }

})


// other

app.get('*', (req, res) => {
    res.status(404).send('Not Found :(')
})



app.listen(PORT, () => console.log(`${name} ${version} running at port ${PORT}`))