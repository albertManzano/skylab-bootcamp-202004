import React, {useState} from 'react'
// import isAuthenticated from 'termometro-client-logic/is-authenticated'
import { Link } from 'react-router-dom'
import './Settings.sass'



function Settings () {
    
    const handleLogOut = () => {
        delete sessionStorage.token
        window.location.reload()
    }

    const handleDeleteAccount = () => {
        
    }

    return (
        <section className='settingsContainer'>
            <h1>Settings</h1>
            <Link className='settingsContainer__option' to='/edit-plan'>Plan</Link>
            <br/>
            <Link className='settingsContainer__option' to='/edit-my-info'>Mis Datos</Link>
            <br/>
            <Link className='settingsContainer__option' >Cambiar Contraseña</Link>
            <br/>
            <button onClick={handleDeleteAccount}>Eliminar mi cuenta</button>
            <br/>
            <button className='settingsContainer__logOut' onClick={handleLogOut}>Log out</button>
        </section>
    )
}

export default Settings