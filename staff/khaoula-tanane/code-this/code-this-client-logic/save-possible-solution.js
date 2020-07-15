/**
 * Checks user's answer.
 * 
 * @param {string} userId The user to whom associate the response. 
 * @param {string} challengeId The challenge that the user wants to save.
 * @param {string} solution The user's answer to the challenge that will be shared. 
 * 
 */
const { utils: { call } } = require('code-this-commons')
const context = require('./context')

module.exports = function (userId, challengeId, solution) {

    const body = JSON.stringify({userId, challengeId, solution}) 
    return call('PATCH', `${this.API_URL}/challenge`, body,
    { 'Content-type': 'application/json' })

    .then(({ status, body }) => {
        if (status === 200) {
            return JSON.parse(body)
        } else {
            const { error } = JSON.parse(body)

            throw new Error(error)
        }
    })
}.bind(context)