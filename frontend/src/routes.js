import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'

import Combination from './pages/Combination/Combination'

import AdminPanel from './pages/AdminPanel'
import CalculatorAdmin from './pages/CalculatorAdmin/'

const Routes = () => (
    <BrowserRouter>
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/calculator-admin' component={CalculatorAdmin} />
        <Route path='/admin' component={AdminPanel} />
        <Route path='/combination/:id?' component={Combination}/>
    </BrowserRouter>
)

export default Routes