import React, { Suspense, lazy, useState, useEffect } from 'react'
import fakeData from './data.json'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'react-feather'

import './styles.css'

const Menu = lazy(() => import('../../components/Menu/'))
const PostPreview = lazy(() => import('../../components/PostPreview'))
const Footer = lazy(() => import('../../components/Footer/Footer'))

const Blog = () => {
    const [ featuredPost, setFeaturedPost ] = useState({})
    const [ latestPosts, setLatestPosts ] = useState([])
    const [ posts, setPosts ] = useState([])

    useEffect(() => {
        // Implementar logica de posts mais recentes
        const [ fp, sp, tp ] = fakeData.filter(data => !data.featured)

        const allposts = [
            fakeData.filter(data => !data.featured),
            fakeData.filter(data => !data.featured),
            fakeData.filter(data => !data.featured)
        ]

        setLatestPosts([ fp, sp, tp ])
        setPosts(allposts)
        setFeaturedPost(fakeData.find(post => post.featured))
    }, [ ])

    return (
        <div className="Blog">
            <Suspense fallback={<div></div>}>
                <Menu searchInput={{ isVisible: true }}/>
            </Suspense>
            <main className="blog-posts">
                <section className="blog-featured-post">
                    <h1 className="blog-title">Destaque:</h1>
                    <Suspense fallback={<div></div>}>
                        <PostPreview post={featuredPost}/>
                    </Suspense>
                </section>
                <section className="blog-latest-posts">
                    <h1 className="blog-title">Mais recentes:</h1>
                    
                    <div>
                        <Suspense fallback={<div></div>}>
                            {latestPosts.map(post => (
                                <PostPreview key={post.path} post={post}/>
                            ))}
                        </Suspense>
                    </div>
                    
                </section>
                <section className="blog-all-posts">
                    <h1 className="blog-title">Todos as postagens:</h1>

                    {posts.map((values, index) => (
                        <div key={index} >
                            {values.map(post => (
                                <Suspense key={post.path} fallback={<div></div>}>
                                    <PostPreview post={post}/>
                                </Suspense>
                            ))}
                        </div>
                    ))}
                    
                </section>

                <div className="blog-pages">
                    <button className='active'><ChevronsLeft/></button>
                    <button><ChevronLeft/></button>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                    <button><ChevronRight/></button>
                    <button><ChevronsRight/></button>
                </div>
            </main>
            <Suspense fallback={<div></div>}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default Blog