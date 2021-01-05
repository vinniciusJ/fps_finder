import React, { useRef } from 'react'

import './styles.css'

const Login = () => {
    const email = useRef('')
    const password = useRef('')

    const handleLogIn = () => {

    }
     
    return(
        <div className="Login">
            <main className="login-section">
                <form className="login-form">
                    <div>
                        <label htmlFor="username">Usuário:</label>
                        <input required type="text" name="username" placeholder="Digite seu username" ref={email}/>
                    </div>
                    <div>
                        <label htmlFor="password">Senha:</label>
                        <input  required type="text" name="password" placeholder="Digite sua senha aqui" ref={password}/>
                    </div>

                    <button className="btn main" onClick={handleLogIn}>Entrar</button>
                </form>
            </main>
        </div>
    )
}

export default Login