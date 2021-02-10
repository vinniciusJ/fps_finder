import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'

import api from '../../services/api'

import './styles.css'

const Login = props => {
    const userInput = useRef('')
    const passwordInput = useRef('')
    const history = useHistory()

    const { location: { state = { from: { pathname: '/admin'} }} } = props

    const handleLogIn = async event => {
        event.preventDefault()

        const { value: credential } = userInput.current
        const { value: password } = passwordInput.current

        try{
            const response = await api.post('/login', { credential, password })

            sessionStorage.setItem('user', response.headers['authtoken'])
            history.push(state.from.pathname)
        }
        catch(error){
            alert('Usuário e/ou senha inválidos')
        }
    }
     
    return(
        <div className="Login">
            <main className="login-section">
                <form className="login-form">
                    <div>
                        <label htmlFor="username">Usuário:</label>
                        <input required  name="username" placeholder="Digite seu username" ref={userInput}/>
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