require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const { random } = Math
const { expect } = require('chai')
require('commons/polyfills/json')
const { mongoose, models: { Symptom } } = require('data')

const { errors: { VoidError, ValueError } } = require('commons')
const updateSymptom = require('./update-symptom')

describe('server logic - update symptom', () => {
    before(() => mongoose.connect(MONGODB_URL))
    before(() => Symptom.deleteMany())
    let content, limit, date, prediction, date2, clicks, HPO_id, name, confidenceLevel, date3, predictionCode, predictionName, HPO_id2, date4, 
    symptom, HPO_id3, name2, confidenceLevel2, date5, comments, modifiers, id, userNavigationTime, serverResponseTime

    beforeEach(async () => {
        await Symptom.deleteMany()

        content = `content-${random()}`
        limit = 1

        date = new Date().toISOString()
        date2 = new Date().toISOString()
        date3 = new Date().toISOString()
        date4 = new Date().toISOString()
        date5 = new Date().toISOString()

        HPO_id = `id-${random()}`
        HPO_id2 = `id2-${random()}`
        HPO_id3 = `id2-${random()}`

        name = `name-${random()}`
        name2 = `name-${random()}`

        confidenceLevel = `conf-${random()}`
        confidenceLevel2 = `conf-${random()}`
        
        predictionCode = `predCode-${random()}`
        predictionName = `predName-${random()}`
        comments = `comment-${random()}`

        userNavigationTime = 0
        serverResponseTime = 0

        clicks = [{HPO_id: HPO_id2, date: date4}]
        prediction = [{predictionCode, predictionName}]
        modifiers = [{HPO_id: HPO_id3, date: date5, name: name2, confidenceLevel: confidenceLevel2}]

        symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks, userNavigationTime, serverResponseTime}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}}

        const result = await Symptom.create(symptom)
        id = result.id
    })

    it('should succeed to update modifiers and comments without altering previous data of the symptom', async () => {

        const _id = await updateSymptom(id, modifiers, comments)

        expect(_id).to.equal(id)

        const updatedSymptoms = await Symptom.find()

        expect(updatedSymptoms.length).to.equal(1)

        const [updatedSymptom] = updatedSymptoms

        const {navigation: {predictorInput: {content: _content, limit: _limit, date: _date}, predictorOutput: {prediction: _prediction, date: _date2}, clicks: _clicks}} = updatedSymptom

        const {submittedTerm: {HPO_id: _HPO_id, name: _name, confidenceLevel: _confidenceLevel, date: _date3}} = updatedSymptom
        const {comments: _comments, modifiers: [{HPO_id: _HPO_id3, date: _date5, name: _name2, confidenceLevel: _confidenceLevel2}]} = updatedSymptom

        expect(updatedSymptom.id).to.equal(id)

        expect(_content).to.equal(content)
        expect(_limit).to.equal(limit)
        expect(_comments).to.equal(comments)
        expect(_prediction[0].predictionName).to.equal(predictionName)
        expect(_prediction[0].predictionCode).to.equal(predictionCode)

        expect(_date.toISOString()).to.equal(date)
        expect(_date2.toISOString()).to.equal(date2)
        expect(_date3.toISOString()).to.equal(date3)
        expect(_clicks[0].date.toISOString()).to.equal(clicks[0].date)
        expect(_date5.toISOString()).to.equal(date5)
        
        expect(_clicks[0].HPO_id).to.equal(clicks[0].HPO_id)
        expect(_HPO_id).to.equal(HPO_id)
        expect(_HPO_id3).to.equal(HPO_id3)

        expect(_name).to.equal(name)
        expect(_name2).to.equal(name2)
        
        expect(_confidenceLevel).to.equal(confidenceLevel)
        expect(_confidenceLevel2).to.equal(confidenceLevel2)

    })

    it('should erase modifiers and comments when they are undefined without altering previous data of the symptom', async () => {

        const _id = await updateSymptom(id)

        expect(_id).to.equal(id)

        const updatedSymptoms = await Symptom.find()

        expect(updatedSymptoms.length).to.equal(1)

        const [updatedSymptom] = updatedSymptoms

        const {navigation: {predictorInput: {content: _content, limit: _limit, date: _date}, predictorOutput: {prediction: _prediction, date: _date2}, clicks: _clicks}} = updatedSymptom

        const {submittedTerm: {HPO_id: _HPO_id, name: _name, confidenceLevel: _confidenceLevel, date: _date3}} = updatedSymptom
        const {comment: _comments, modifiers: _modifiers} = updatedSymptom

        expect(updatedSymptom.id).to.equal(id)

        expect(_content).to.equal(content)
        expect(_limit).to.equal(limit)
        expect(_prediction[0].predictionName).to.equal(predictionName)
        expect(_prediction[0].predictionCode).to.equal(predictionCode)

        expect(_date.toISOString()).to.equal(date)
        expect(_date2.toISOString()).to.equal(date2)
        expect(_date3.toISOString()).to.equal(date3)
        expect(_clicks[0].date.toISOString()).to.equal(clicks[0].date)
        
        
        expect(_clicks[0].HPO_id).to.equal(clicks[0].HPO_id)
        expect(_HPO_id).to.equal(HPO_id)

        expect(_name).to.equal(name)
        
        
        expect(_confidenceLevel).to.equal(confidenceLevel)
        
        
        expect(_comments).to.not.exist
        expect(_modifiers).to.be.an.instanceof(Array)
        expect(_modifiers.length).to.equal(0)
    })

    describe('when inputs with incorrect format are introduced', async () => {
        
        it('should fail when empty strings are introduced', async () => {
            
            try {
                confidenceLevel2 = ""
                modifiers = [{HPO_id: HPO_id3, date: date5, name: name2, confidenceLevel: confidenceLevel2}]

                symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}, modifiers, comments}                
                updateSymptom(id, modifiers, comments)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }

            try {
                name2 = ""
                modifiers = [{HPO_id: HPO_id3, date: date5, name: name2, confidenceLevel: confidenceLevel2}]

                symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}, modifiers, comments}                
                updateSymptom(id, modifiers, comments)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }

            try {
                HPO_id3 = ""
                modifiers = [{HPO_id: HPO_id3, date: date5, name: name2, confidenceLevel: confidenceLevel2}]

                symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}, modifiers, comments}                
                updateSymptom(id, modifiers, comments)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(VoidError)
                expect(error.message).to.equal(`string is empty or blank`)
            }

            try {
                modifiers = "hi"

                updateSymptom(id, modifiers, comments)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(`hi is not a valid JSON`)
            }
        })

        it('should fail when non-string inputs are introduced', async () => {

            try {
                confidenceLevel2 = []
                modifiers = [{HPO_id: HPO_id3, date: date5, name: name2, confidenceLevel: confidenceLevel2}]

                symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}, modifiers, comments}                
                updateSymptom(id, modifiers, comments)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                name2 = []
                modifiers = [{HPO_id: HPO_id3, date: date5, name: name2, confidenceLevel: confidenceLevel2}]

                symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}, modifiers, comments}                
                updateSymptom(id, modifiers, comments)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }

            try {
                HPO_id3 = []
                modifiers = [{HPO_id: HPO_id3, date: date5, name: name2, confidenceLevel: confidenceLevel2}]

                symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}, modifiers, comments}                
                updateSymptom(id, modifiers, comments)
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }
        })

        it('should fail when non-ISODate inputs are introduced', async () => {

            try{
                date5 = []
                modifiers = [{HPO_id: HPO_id3, date: date5, name: name2, confidenceLevel: confidenceLevel2}]

                symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}, modifiers, comments}                
                updateSymptom(id, modifiers, comments)

            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(TypeError)
                expect(error.message).to.equal(` is not a string`)
            }
        })

    })

    afterEach(() => Symptom.deleteMany())

    after(mongoose.disconnect)
})