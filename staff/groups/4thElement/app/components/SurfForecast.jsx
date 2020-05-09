const { useState, useEffect } = React

function SurfForecast({token, forecastSelected}) {

    const handleFavButton = (token) => {
        addToFavs(token, forecastSelected, (error) => {
            if(error) throw new TypeError('error')
        })
    }

    const [forecast, setForecast] = useState()


    useEffect(() => {
        surfForecastLogic({forecastSelected}, function (error, info) {
            setForecast(info)
        })
    }, [forecastSelected]);

    return <section className="spot-result-list">

        {
            forecast ? (<>

                <ul className='ul-spot-forecast'>
                    {forecast.data.weather.map((element) => {
                        return <li className='li-spot-forecast-date'>{`${element.date}`}

                            {element.hourly.map((forTime) => {
                                return <li className='li-spot-forecast-info'>{`${forTime.time}h  ${forTime.tempC}ºC ${forTime.windspeedKmph}Km/h  ${forTime.swellHeight_m}m`} </li>
                            })}

                        </li>
                    })}
                </ul>
            </>)
                : (
                    <Feedback message="sorry, no results :(" />
                )
        }
              <div className='fav-button' onClick={()=>handleFavButton(token)}><i className="fas fa-star star-fore fa-2x"></i></div>
              
    </section>
}
