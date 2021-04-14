import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Blog from './pages/Blog/'
import Post from './pages/Post/'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import AboutUs from './pages/AboutUs/'
import AdminPanel from './pages/AdminPanel'
import Combination from './pages/Combination/Combination'
import CalculatorAdmin from './pages/CalculatorAdmin/'

const Routes = () => (
    <BrowserRouter>
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/blog' component={Blog}/>
        <Route path='/calculator-admin' component={CalculatorAdmin} />
        <Route path='/admin' component={AdminPanel} />
        <Route path='/combination/:id?' component={Combination}/>
        <Route path='/about-us' component={AboutUs}/>
        <Route path='/post/:id?' component={Post} />
    </BrowserRouter>
)

export default Routes