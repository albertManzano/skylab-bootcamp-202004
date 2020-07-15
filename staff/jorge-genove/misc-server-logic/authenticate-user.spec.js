require('dotenv').config()

const { env : { TEST_MONGODB_URL: MONGODB_URL} }  = process

const authenticateUser = require('./authenticate-user')
const { random } = Math
const { expect } = require('chai')
const { mongo } =require('misc-data')

describe('logic - authenticate user', () => {
    let users

    before(() => mongo.connect(MONGODB_URL).then(connection => users = connection.db().collection('users')))

    let name,surname,email,password, userId

    beforeEach(() =>
        users.deleteMany()
            .then(() => {
                name = `name-${random()}`
                surname = `surname-${random()}`
                email = `e-${random()}@mail.com`
                password = `password-${random()}`
            })
    )
    
    describe('when user already exists', () => {
        beforeEach(() => {
            const user = { name, surname, email, password }

            return users.insertOne(user)
                .then(result=> user.Id = result.insertedId.toString())
            })
        

        it('should succeed on correct credentials', () => 
            authenticateUser(email, password)
                .then(_userId => expect(_userId).to.equal(_userId))
        )


        it('should fail on wrong password', ()=> {
            password += 'wrong-'

            authenticateUser(email, password)
                .then(() => { throw new Error('should not reach this point')})
                .catch(error => {
                    expect(error).to.be.an.instanceof(Error)
                    expect(error.message).to.equal(`Wrong password`)
                })

        })
    })

    it('should fail when user does not exist', () => 
        authenticateUser(email, password) 
            .then(() => {throw new Error('should not reach this point')})
            .catch(error => {
                expect(error).to.be.an.instanceOf(Error)
                expect(error.message).to.equal(`users with that ${email} already exist`)
            })
    )
           


    afterEach(() => users.deleteMany())
    
    after(() => users.deleteMany().then(mongo.disconnect))
 })
