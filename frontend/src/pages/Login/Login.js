import React, { useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'

import api from '../../services/api'

import './styles.css'

const Login = () => {
    const emailInput = useRef('')
    const passwordInput = useRef('')
    const [ isThereUser, setIsThereUser ] = useState(false)

    const handleLogIn = event => {
        event.preventDefault()

        const email = emailInput.current.value
        const password = passwordInput.current.value

        api.get('/user', { params: { email, password } }).then(response => {
            if(response.status === 400){
                alert(response.data.message)

                return
            }
            
            setIsThereUser(true)
        })
    }
     
    return(
        <div className="Login">
            <main className="login-section">
                <form className="login-form">
                    <div>
                        <label htmlFor="username">Usuário:</label>
                        <input required type="email" name="username" placeholder="Digite seu username" ref={emailInput}/>
                    </div>
                    <div>
                        <label htmlFor="password">Senha:</label>
                        <input  required type="password" name="password" placeholder="Digite sua senha aqui" ref={passwordInput}/>
                    </div>

                    <button className="btn main" onClick={handleLogIn}>Entrar</button>
                </form>
            </main>
            {isThereUser && <Redirect to='/'/>}
        </div>
    )
}

export default Login