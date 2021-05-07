import { useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'

import './styles.css'

const AdminPanel = props => {
    const user = sessionStorage.getItem('user')

    useEffect(() => document.title = 'Admin', [ ])

    return (
        <div className="adminpanel-container">
            { user ? (
                <main className="adminpanel-routes">
                    <Link to='/2054dbb5f81969e56eede7fa2078218c/calculator' className='adminpanel-route-link'>
                        <h1>Painel Calculadora</h1>
                    </Link>
                    <Link to='/2054dbb5f81969e56eede7fa2078218c/blog' className='adminpanel-route-link'>
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