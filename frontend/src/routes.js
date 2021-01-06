import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Admin from './pages/Admin/Admin'

const Routes = () => (
    <BrowserRouter>
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/admin' component={Admin} />
    </BrowserRouter>
)

export default Routes