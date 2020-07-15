require('misc-commons/polyfills/string')
const { errors: {UnexistenceError} } = require('misc-commons')
const {mongo} = require('misc-data')

module.exports = (userId, query) => {
    if(typeof query !== 'object') throw new Error
    String.validate.notVoid(userId)
    
    
    return mongo.connect()
        .then(connection =>{
            const users = connection.db().collection('users')
            
            return users.find(query) 
        })
        .then(results => {
            if (results.toArray().length === 0) throw new UnexistenceError("No matches were found")
            return results.toArray()
        })
        
}
    
