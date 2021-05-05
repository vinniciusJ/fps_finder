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
                    <Link to='/admin/calculator' className='adminpanel-route-link'>
                        <h1>Painel Calculadora</h1>
                    </Link>
                    <Link to='/admin/blog' className='adminpanel-route-link'>
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