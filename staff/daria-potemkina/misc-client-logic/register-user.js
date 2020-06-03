require('misc-commons/polyfills/string')
const { utils: { Email, call } } = require('misc-commons')

module.exports = (name, surname, email, password) => {
    String.validate(name)
    String.validate(surname)

    Email.validate(email)

    String.validate.lengthGreaterEqualThan(password, 8)

    return call('POST', 'http://localhost:8080/users',
        `{ "name": "${name}", "surname": "${surname}", "email": "${email}", "password": "${password}" }`,
        { 'Content-type': 'application/json' })
        .then(({ status, response }) => {
            if (status !== 201) {
                const { error } = JSON.parse(response)
                throw new Error(error)
            }
            return {}
        })
}
