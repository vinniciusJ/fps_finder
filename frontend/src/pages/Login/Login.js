import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'

import api from '../../services/api'

import './styles.css'

const Login = props => {
    const userInput = useRef('')
    const passwordInput = useRef('')
    const history = useHistory()

    const { location: { state = { from: { pathname: '/admin'} }} } = props

    const handleLogIn = event => {
        event.preventDefault()

        const { value: credential } = userInput.current
        const { value: password } = passwordInput.current

        api.post('/signup', { credential, password }).then(response => {
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