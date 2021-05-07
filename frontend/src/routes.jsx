import { BrowserRouter, Route } from 'react-router-dom'

import Blog from './pages/Blog'
import Post from './pages/Post'
import Home from './pages/Home'
import Login from './pages/Login'
import AboutUs from './pages/AboutUs'
import BlogAdmin from './pages/BlogAdmin'
import PostViewer from './pages/PostViewer'
import AdminPanel from './pages/AdminPanel'
import Combination from './pages/Combination'
import CalculatorAdmin from './pages/CalculatorAdmin'

const Routes = () => (
    <BrowserRouter>
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/blog' exact component={Blog}/>
        <Route path='/blog/post/:slug?' component={PostViewer}/>
        <Route path='/about-us' component={AboutUs}/>
    
        <Route path='/2054dbb5f81969e56eede7fa2078218c' exact component={AdminPanel} />
        <Route path='/2054dbb5f81969e56eede7fa2078218c/blog' exact component={BlogAdmin} />
        <Route path='/2054dbb5f81969e56eede7fa2078218c/blog/post/:slug?' component={Post} />
        <Route path='/2054dbb5f81969e56eede7fa2078218c/calculator' exact component={CalculatorAdmin} />
        <Route path='/2054dbb5f81969e56eede7fa2078218c/calculator/combination/:id?' component={Combination}/>
        
    </BrowserRouter>
)

export default Routes