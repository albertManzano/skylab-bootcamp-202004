/**
  * Register new user. 
  * 
  * @param {string} token Users token
  * 
  * @param {function} callback The expression to be called after checking credentials, will recieve an Error or authentication token.
  *
  * @throws {TypeError} If any of the parameters does not match the corresponding type or if callback is not a function.
  * @throws {Error} If does not match the expected format.
  */
function retrieveNews(token, callback) {

    String.validate.notVoid(token);

    Function.validate(callback);

    let __news = []

    const numberOfPages = []

    const NEWS_FOR_PAGE = 20

    call('GET', 'https://skylabcoders.herokuapp.com/api/v2/users',
        undefined,
        { 'Authorization': `Bearer ${token}` },
        (error, status, body) => {
            if (error) return callback(error)

            if (status === 200) {

                const user = JSON.parse(body)

                const { categories, country, favorite = [] } = user

                let result = Object.keys(categories).map(function (key) { return [String(key), categories[key]] })

                let _categories = []

                for (let i in result) {
                    if (result[i][1]) {
                        _categories.push(result[i][0])
                    }
                }

                let counter = 0
          
                for (let i = 0; i < _categories.length; i++) {

                    call('GET', `https://newsapi.org/v2/top-headlines?country=${country}&category=${_categories[i]}&apiKey=0d80af4c6ef6473aae5bb15fcf9eb625`,


                        undefined,
                        undefined,
                        (error, status, body) => {
                            if (error) return callback(error)

                            if (status === 200) {
                                counter++
                                const news = JSON.parse(body)

                                const { articles } = news

                                for (let i in articles) {
                                    const { source, author, title, description, url, urlToImage, publishedAt } = articles[i]

                                    if (typeof source !== "undefined") {
                                        const { name } = source
                                        __news.push({ name, author, title, description, url, urlToImage, publishedAt })

                                    }
                                    else {
                                        const name = "unknown"
                                        __news.push({ name, author, title, description, url, urlToImage, publishedAt })
                                    }

                                }
                                __news = __news.map(({ name, author, title, description, url, urlToImage, publishedAt }) => {
                                    const _news = { name, author, title, description, url, urlToImage, publishedAt }
                                    _news.favorites = favorite.includes(title)
                                    return _news
                                })

                            } else {
                                const { error } = JSON.parse(body)
                                callback(new Error(error))
                            }


                            if (counter === _categories.length){

                                for(let i = 0; i < Math.ceil(__news.length/NEWS_FOR_PAGE); i++){
                                    numberOfPages.push(i+1)
                                }

                                const newsUnique = getUnique(__news, element=>element.title)

                                callback(undefined, newsUnique, numberOfPages)
                            } 

                        })
                }

            } else {
                const { error } = JSON.parse(body)
                callback(new Error(error))
            }

        })
}

/**
 * Invoked after remote authentication.
 * 
 * @callback callback
 * @param {Error} error It may receive an error in case remote logic fails or there is a network problem.
 * @param {Array} __news Array of objects with the news
 * @param {Number} numberOfPages numbers of pages in news
 */