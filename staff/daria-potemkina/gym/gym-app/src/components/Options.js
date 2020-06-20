import React, { useState } from 'react'
import { addProduct } from 'gym-client-logic'
import Feedback from './Feedback'
import './Products.sass'

export default function ({ token, options, handleGoToDetails }) {
    const [error, setError] = useState()
    const [success, setSuccess] = useState()

    const handleSubmit = (event, id, priceId) => {
        event.preventDefault()

        let { quantity, side } = event.target

        quantity = Number(quantity.value)
        side = side.value

        try {
            addProduct(token, id, priceId, side, quantity)
                .then(() => {
                    setSuccess({ id, message: 'trade has been added to the portfolio' })
                    return
                })
                .catch(({ message }) => setError([id, message]))
        } catch ({ message }) {
            setError([id, message])
        }
    }

    return <section className='products'>
        <h1 className="products__title">Options</h1>
        <ul>{
            options.map(option =>
                <li className="products__item">
                    <button className="products__details" onClick={event => {
                        event.preventDefault()

                        handleGoToDetails(option)
                    }}>
                        <p>{option.ticker}</p>
                        <p>{option.settlementDate}</p>
                        <p>{option.side}</p>
                        <p>{`${option.type.strike}€`}</p>
                        <p>{`${option.price}€`}</p>
                    </button>
                    <section className="products__form">
                        <form onSubmit={event => handleSubmit(event, option._id, option.priceId)}>
                            <section className="products__select">
                                <select className="products__input" name="quantity">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                                <select className="products__input" name='side'>
                                    <option value='Buy'>Buy</option>
                                    <option value='Sell'>Sell</option>
                                </select>
                            </section>
                            <button className="products__button">Trade</button>
                            {error && error[0] === option._id && <Feedback message={error[1]} level="error" />}
                            {success && success.id === option._id && <Feedback message={success.message} level="" />}
                        </form>
                    </section>
                </li>
            )}
        </ul>
    </section>
}