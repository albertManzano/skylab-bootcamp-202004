function createTweet(token, message, callback) {
    if (typeof message !== 'string') throw new TypeError(message + ' is not a string')
    if (!TEXT_REGEX.test(message)) throw new Error(message + ' is not alphabetic')
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    let newDate = new Date;
    newDate= newDate.toDateString();
    call('GET', 'https://skylabcoders.herokuapp.com/api/v2/users', undefined ,  
     { 'Authorization': `Bearer ${token}`}, 
    (error, status, body) => {
      if (error) return callback(error)

      if (status === 200){
        callback()
        const bodyObj=JSON.parse(body)
        const {username} = bodyObj
        const newTweet={username , message , newDate}
        if(!bodyObj.tweets) bodyObj.tweets=[]
        bodyObj.tweets.push(newTweet)

        call('PATCH', 'https://skylabcoders.herokuapp.com/api/v2/users',JSON.stringify(bodyObj) ,  
     { 'Content-type': 'application/json' , 'Authorization': `Bearer ${token}`}, 
    (error, status, body) => {
      if (error) return callback(error)

      if (status === 204){
          callback()
      } else {
                const { error } = JSON.parse(body)

                callback(new Error(error))
            }
     
        })
    }
    })
    
 }
