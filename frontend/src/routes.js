import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import AdminPanel from './pages/AdminPanel/AdminPanel'
import Combination from './pages/Combination/Combination'

const Routes = () => (
    <BrowserRouter>
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/admin' component={AdminPanel} />
        <Route path='/combination' component={Combination}/>
    </BrowserRouter>
)

export default Routes