import React from 'react'
import { Redirect } from 'react-router-dom'

import './styles.css'

const AdminPanel = props => {
    const userAuth = sessionStorage.getItem('user')

    return (
        <div className="adminpanel-container">
            { userAuth ? (
                <main className="adminpanel-routes">
                    <a href="/calculator-admin" className="adminpanel-route-link">
                        <h1>Painel Calculadora</h1>
                    </a>
                    <a href="/" className="adminpanel-route-link">
                        <h1>Painel Blog</h1>
                    </a>
                </main>
                
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
            )}
        </div>
    )
}

export default AdminPanel