require('misc-commons/polyfills/string')
require('misc-commons/polyfills/number')
const { errors: {UnexistenceError}, utils: {Email}} = require('misc-commons')
const { mongo } = require('misc-data')
const { ObjectId } = mongo

module.exports = (userId, productId, quantity) => {
    String.validate.notVoid(userId)
    String.validate.notVoid(productId)
    Number.validate.positive(quantity)

    return mongo.connect()
        .then(connection => {
            const users = connection.db().collection('users')

            return users.findOne({_id: ObjectId(userId)})
                .then(user => {
                    if(!user) throw new UnexistanceError (`user with id ${userId} does not exist`)

                    const { cart = [] } = user

                    const index = cart.findIndex(item => item.product.toString() === productId)
                    
                    if(quantity === 0) {
                        if(index < 0) throw new UnexistanceError(`product with id ${productId} does not exist in cart for user with id ${userId}`)

                        cart.splice(index, 1)
                    } else{
                        let product

                        if(index < 0){
                            product = { product: ObjectId(productId)}
                            
                            cart.push(product)
                        } else {
                            product = cart[index]  
                        }
                        product.quantity = quantity
                    }

                return users.updateOne({_id: ObjectId(userId)}, { $set: { cart }})
                })
                .then(() => {})
        })

}