require('dotenv').config()
const { env: { API_URL } } = process
const context = require('./context')
context.API_URL = API_URL

const { expect } = require('chai')
const { errors: { VoidError } } = require('commons')

const retrieveTermsById = require('./retrieve-terms-by-id')

describe('client logic - retrieve-terms-by-id', () => {
    let HPO_id = "HP:0000010"

    describe('when the term exists', () => {

        it('should succeed on correct id', () =>{
            context.API_URL = API_URL

            return retrieveTermsById(HPO_id)
                .then(result => {
                    expect(result.term).to.exist

                    expect(result.term.HPO_id).to.equal(HPO_id)
                    expect(result.term._id).to.not.exist
                    expect(result.term.__v).to.not.exist
                    expect(result.term.xref).to.not.exist
                    expect(result.lower).to.be.an.instanceof(Array)
                    expect(result.higher).to.be.an.instanceof(Array)

                    expect(result.higher[0].HPO_id).to.exist
                    expect(result.higher[0]._id).to.not.exist
                    expect(result.higher[0].__v).to.not.exist
                    expect(result.higher[0].xref).to.not.exist

                    expect(result.lower[0].HPO_id).to.exist
                    expect(result.lower[0]._id).to.not.exist
                    expect(result.lower[0].__v).to.not.exist
                    expect(result.lower[0].xref).to.not.exist
                })
        })
    })

    it('should fail when term does not exist', () => {
        const newHPO_id = "HP:1000010"
        context.API_URL = API_URL

        return retrieveTermsById(newHPO_id)
            .catch(error => {
                expect(error).to.exist

                expect(error.message).to.equal(`Term with HPO id ${newHPO_id} does not exist`)
            })
    })

    it('should fail when input does not fit the format', async () => {
        try{
            await retrieveTermsById("")
        }catch(error){
            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try{
            await retrieveTermsById([])
        }catch(error){
            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(` is not a string`)
        }
    })
})