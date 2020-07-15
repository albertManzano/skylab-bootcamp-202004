const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { PORT, SECRET= 'hola' } = process.env
const { registerUser, authenticateUser, retrieveUser, addContact, searchContact, addSticky } = require('./logic')
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')
const { handleError} = require('./helpers')
const {JsonWebTokenError} = jwt
const parseBody = bodyParser.json()


const app = express()

// users

app.post('/users', parseBody, (req, res) => {
    const { body: { name, surname, email, password } } = req
    try {
        registerUser(name, surname, email, password)
            .then(()=> res.status(201).send())
            .catch(error => handleError(error, res))        
    } catch (error) {
        handleError(error, res)
    }
})

app.post('/users/auth', parseBody, (req, res) => {
    const { body: { email, password } } = req

    try {
        authenticateUser(email, password)
        .then((userId) =>{ 
            const token = jwt.sign({sub: userId}, SECRET, {expiresIn: '1d'}) 
            res.send({ token })    
        })
        .catch(error => handleError(error, res))  
    } catch(error) {
        handleError(error, res)
    }
})

app.get('/users/:userId?', (req, res) => {
    try{
        if(req.params.userId) {
            const {userId} = req.params
            
            retrieveUser(userId)
            .then((user) => res.send( user ))
            .catch((error) => handleError(error, res) )
               
        }   
        else {
            const [, token] = req.header('authorization').split(' ')
            const {sub : userId} = jwt.verify(token, SECRET)
            
            retrieveUser(userId)
                .then((user) => res.send(user))
                .catch((error) => handleError(error, res))
        }
    }catch(error) {
        handleError(error, res)
    }
})

// contacts

app.post('/contacts', parseBody, (req, res) => {
    try{
        const [,token] = req.header('authorization').split(' ')
        const {sub: userId} = jwt.verify(token, SECRET)
        const { body: contact } = req

        addContact(userId, contact)
            .then((user) => res.send({ contactId }))
            .catch((error) => handleError(error, res))            
    
    }catch(error) {
        handleError(error, res)
    }
})

app.get('/contacts/:contactId', (req, res) => {
    const [,token] = req.header('authorization').split(' ')
    const {sub: userId} = jwt.verify(token, SECRET)
    const {contactId} = req.params

    try {
        searchContact(userId, contact)
            .then((_contacts) => res.send({contact}))
            .catch((error) => handleError(error, res))

    } catch (error) {
        handleError(error, res)  
    }
})

app.post('/users/stickies', parseBody, (req, res) => {
    
    const [,token] = req.header('authorization').split(' ')
    const {sub: userId} = jwt.verify(token, SECRET)
    const { body: sticky} = req
    
    try {
        addSticky(userId, sticky, (error, stickyId)=>{
            if(error) return res.status(404).json({error: error.message})
            res.send(stickyId)
        })
    } catch (error) {
        res.status(406).json({error: error.message})  
    }

})

app.get('contacts/search', parseBody, (req,res) => {
    const [,token] = req.header('authorization').split(' ')

    const {sub: userId} = jwt.verify(token, SECRET)

    const query = req.query.q

    try {
        searchContact(userId, query, (error, contact) => {
            if(error) return res.status(404).json({error: error.message})
            res.send({contact})
        })
    } catch (error) {
        res.status(406).json({error: error.message})   
    }
})
// other


app.get('*', (req, res) => {
    res.status(404).send('Not Found :(')
})

app.listen(8080, () => console.log(`${name} ${version} running`))