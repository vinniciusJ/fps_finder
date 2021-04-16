import React, { Suspense, lazy, useState, useEffect } from 'react'
import axios from 'axios'

import { blogAPI } from '../../services/api'
import { Redirect } from 'react-router-dom'
import { PostInterface } from '../../utils/interfaces.json'

import './styles.css'

const AdminMenu = lazy(() => import('../../components/AdminMenu'))
const PostPreview = lazy(() => import('../../components/PostPreview'))


const BlogAdmin = props => {
    const user = sessionStorage.getItem('user')

    const [ posts, setPosts ] = useState([ PostInterface ])
    const [ totalPosts, setTotalPosts ] = useState(0)
    const [ featuredPost, setFeaturedPost ] = useState({ ...PostInterface })

    useEffect(() => (async () => {
        const source = axios.CancelToken.source()

        try{
            const receivedPosts = await (await blogAPI.get(`/`, { cancelToken: source.token } )).data
            
            setTotalPosts(receivedPosts.length)
            setPosts(receivedPosts.filter(receivedPost => !receivedPost.featured))
            setFeaturedPost(receivedPosts.find(receivedPost => receivedPost.featured))
        }
        catch(error){
            alert(error.message)
        }

        return () => source.cancel("Requisição Cancelada")
    })(), [ ])


    return (
        <div className="BlogAdmin">
            {user ? (
                <>
                <Suspense fallback={<div></div>}>
                    <AdminMenu onSearch={() => {}} total={totalPosts} type="post"/>
                </Suspense>
                <main className="ba-post">
                    <section className="ba-featured-post">
                        <h2>Postagem em Destaque:</h2>
                        <Suspense fallback={<div></div>}>
                            <PostPreview post={featuredPost} admin={true}/>
                        </Suspense>
                    </section>
                    <section className="ba-saved-posts">
                        <h2>Postagens salvas:</h2>

                        <Suspense fallback={<div></div>}>
                            {posts.filter(post => !post.published).map(post => (
                                <PostPreview key={`${post.id}-${Date.now()}`} post={post} admin={true}/>
                            ))}
                            
                        </Suspense>
                    </section>
                    <section className="ba-all-posts">
                        <h2>Postagens publicadas:</h2>

                        <Suspense fallback={<div></div>}>
                            {posts.filter(post => post.published).map(post => (
                                <PostPreview key={`${post.id}-${Date.now()}`} post={post} admin={true}/>
                            ))}
                            
                        </Suspense>
                    </section>
                </main>
                </>
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
            )}
        </div>
    )
}

export default BlogAdmin