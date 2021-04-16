import React from 'react'
import { Link, Redirect } from 'react-router-dom'

import './styles.css'

const AdminPanel = props => {
    const user = sessionStorage.getItem('user')

    return (
        <div className="adminpanel-container">
            { user ? (
                <main className="adminpanel-routes">
                    <Link to='/calculator-admin' className='adminpanel-route-link'>
                        <h1>Painel Calculadora</h1>
                    </Link>
                    <Link to='/blog-admin' className='adminpanel-route-link'>
                        <h1>Painel Blog</h1>
                    </Link>
                </main>
                
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
            )}
        </div>
    )
}

export default AdminPanel