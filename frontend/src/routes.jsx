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
    
        <Route path='/admin' exact component={AdminPanel} />
        <Route path='/post/:id?' component={Post} />
        <Route path='/combination/:id?' component={Combination}/>
        <Route path='/admin/calculator' component={CalculatorAdmin} />
        <Route path='/admin/blog' component={BlogAdmin} />
    </BrowserRouter>
)

export default Routes