import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'

import api from '../../services/api'

import './styles.css'

const Login = props => {
    const emailInput = useRef('')
    const passwordInput = useRef('')
    const history = useHistory()

    const { location: { state = { from: { pathname: '/admin'} }} } = props

    const handleLogIn = event => {
        event.preventDefault()

        const email = emailInput.current.value
        const password = passwordInput.current.value

        api.post('/user', { email, password }).then(response => {
            if(response.status === 400){
                alert(response.data.message)

                return
            }
            
            sessionStorage.setItem('user', response.headers['authtoken'])
            history.push(state.from.pathname)
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
            
        </div>
    )
}

export default Login