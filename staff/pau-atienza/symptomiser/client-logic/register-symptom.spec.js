require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL , API_URL } } = process
const context = require('./context')
context.API_URL = API_URL
context.storage = {}

const registerSymptom = require('./register-symptom')
const { random } = Math
const { expect } = require('chai')
require('commons/polyfills/json')
const { mongoose, models: { Symptom } } = require('data')

const { errors: { VoidError, ValueError } } = require('commons')

describe('client logic - register symptom', () => {
    before(() => mongoose.connect(MONGODB_URL))
    before(done => {Symptom.deleteMany(); done()})
    let content, limit, date, prediction, date2, clicks, HPO_id, name, confidenceLevel, date3, predictionCode, predictionName, HPO_id2, date4, symptom

    beforeEach(async () => {
        await Symptom.deleteMany()

        content = `content-${random()}`
        limit = 1
        date = new Date().toISOString()
        date2 = new Date().toISOString()
        date4 = new Date().toISOString()

        HPO_id = `id-${random()}`
        name = `name-${random()}`
        confidenceLevel = `conf-${random()}`

        predictionCode = `predCode-${random()}`
        predictionName = `predName-${random()}`
        HPO_id2 = `id2-${random()}`


        clicks = [{HPO_id: HPO_id2, date: date4}]
        prediction = [{predictionCode, predictionName}]

        context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
        context.API_URL = API_URL
    })

    it('should succeed on valid data', async () => {
        const {id} = await registerSymptom(HPO_id, name, confidenceLevel)

        expect(typeof id).to.equal('string')

        const symptoms = await Symptom.find()
        
        expect(symptoms.length).to.equal(1)

        const [retrievedSymptom] = symptoms

        const {navigation: {predictorInput: {content: _content, limit: _limit, date: _date}, predictorOutput: {prediction: _prediction, date: _date2}, clicks: _clicks, serverResponseTime, userNavigationTime}} = retrievedSymptom

        const {submittedTerm: {HPO_id: _HPO_id, name: _name, confidenceLevel: _confidenceLevel, date: _date3}} = retrievedSymptom

        expect(retrievedSymptom.id).to.equal(id)
        
        expect(_date.toISOString()).to.equal(date)
        expect(_date2.toISOString()).to.equal(date2)
        expect(_clicks[0].date.toISOString()).to.equal((clicks[0].date))
        expect(_date3).to.be.an.instanceof(Date)

        expect(_content).to.equal(content)
        expect(_limit).to.equal(limit)
        expect(_prediction[0].predictionName).to.equal(predictionName)
        expect(_prediction[0].predictionCode).to.equal(predictionCode)
        expect(_clicks[0].HPO_id).to.equal(clicks[0].HPO_id)
        expect(_HPO_id).to.equal(HPO_id)
        expect(_name).to.equal(name)
        expect(_confidenceLevel).to.equal(confidenceLevel)

        expect(userNavigationTime).to.equal(0)
        expect(serverResponseTime).to.equal(0)
    })

    it('should register navigation and response times', async () => {

        date2 = new Date("2020-06-19T15:42:37.821+00:00").toISOString()
        date2 = new Date("2020-06-19T15:50:45.821+00:00").toISOString()
        
        clicks = [{HPO_id: HPO_id2, date: date4}]
        prediction = [{predictionCode, predictionName}]

        symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}}

        const {id} = await registerSymptom(HPO_id, name, confidenceLevel)
        
        expect(typeof id).to.equal('string')

        const symptoms = await Symptom.find()

        expect(symptoms.length).to.equal(1)

        const [retrievedSymptom] = symptoms

        const {navigation: { serverResponseTime, userNavigationTime}} = retrievedSymptom
        
        expect(typeof userNavigationTime).to.equal('number')
        expect(typeof serverResponseTime).to.equal('number')
    })

    describe('when inputs with incorrect format are introduced', async () => {
        
        it('should fail when empty strings are introduced', async () => {
            try {
                predictionCode = ""
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }

            try {
                predictionName = ""
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }

            try {
                HPO_id2 = ""
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }
            try {
                content = ""
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }

            try {
                HPO_id = ""
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }

            try {
                name = ""
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }

            try {
                confidenceLevel = ""
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }
        })

        it('should fail when non-string inputs are introduced', async () => {
            try {
                predictionCode = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                predictionName = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                HPO_id2 = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }
            try {
                content = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                HPO_id = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                name = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                confidenceLevel = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }
        })

        it('should fail when non-number inputs are introduced', async () => {
            try {
                limit = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(ValueError)
                expect(error.message).to.equal(` is not greater or equal than 1`)
            }
        })

        it('should fail when non-ISOString inputs are introduced', async () => {
            try {
                date = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                date2 = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                date3 = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                date4 = []
                clicks = [{HPO_id: HPO_id2, date: date4}]
                prediction = [{predictionCode, predictionName}]
                context.storage.navigation = JSON.stringify({predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks})
                registerSymptom(HPO_id, name, confidenceLevel)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }
        })

        it('should fail whenan HPO_id that doesn\'t fit the format is introduced', async () => {
            context.API_URL = "http://localhost:8080/api/random"

            registerSymptom(HPO_id, name, confidenceLevel)
                .catch(error=>expect(error).to.exist)
        })

    })

    afterEach(() => Symptom.deleteMany())

    after(mongoose.disconnect)
})