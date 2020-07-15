function authenticateUser(email, password, callback) {
    if (typeof email !== 'string') throw new TypeError(email + ' is not a string')
    if (!EMAIL_REGEX.test(email)) throw new Error(email + ' is not an e-mail')

    if (typeof password !== 'string') throw new TypeError(password + ' is not a string')
    if (!password.trim().length) throw new Error('password is empty or blank')

    call('POST', 'https://skylabcoders.herokuapp.com/api/v2/users/auth', `{"username": "${email}", "password": "${password}"}`,
        { 'Content-type': 'application/json' }, (error, status, response) => {
            if (error) return callback(error)

            if (status === 200) {
                const { token } = JSON.parse(response)

                callback(undefined, token)
            } else {
                const { error } = JSON.parse(response)

                callback(new Error(error))
            }
        })
}
