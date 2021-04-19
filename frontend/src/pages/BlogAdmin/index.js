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

    const [ totalPosts, setTotalPosts ] = useState(0)

    const [ savedPosts, setSavedPosts ] = useState([])
    const [ publishedPosts, setPublishedPosts ] = useState([])
    const [ featuredPost, setFeaturedPost ] = useState({ ...PostInterface })
    const [ isSmallScreen, setIsSmallScreen ] = useState(false)

    const reduceArray = array => array.reduce((rows, key, index) => (
        (index % 3 === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows
    ), [])



    useEffect(() => (async () => {
        const source = axios.CancelToken.source()

        try{
            const receivedPosts = await (await blogAPI.get(`/`, { cancelToken: source.token } )).data
            
            const [ receivedSavedPosts, receivedPublishedPosts ] = [
                receivedPosts.filter(post => !post.published && !post.featured),
                receivedPosts.filter(post => post.published && !post.featured)
            ]

            const screenStatus = window.matchMedia('(min-width: 1024px)').matches

            
            setTotalPosts(receivedPosts.length)
            setFeaturedPost(receivedPosts.find(receivedPost => receivedPost.featured))
           
            if(screenStatus){
                const [ saved, published ] = [
                    reduceArray(receivedSavedPosts),
                    reduceArray(receivedPublishedPosts)
                ]

                setSavedPosts(Array.isArray(saved[0]) ? saved : [ [ saved ] ])
                setPublishedPosts(Array.isArray(published[0]) ? published : [ [ published ] ])

                return 
            }

            setIsSmallScreen(screenStatus)
            setSavedPosts(receivedSavedPosts)
            setPublishedPosts(receivedPublishedPosts)
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
                            { isSmallScreen && (
                                    <>
                                        {savedPosts.map(post => (
                                            <PostPreview key={`${post.id}-${Date.now()}`} post={post} admin={true}/>
                                        ))}
                                    </>
                                    ) }

                                { isSmallScreen || (
                                    <div className="ba-saved-posts-rows">
                                        {savedPosts.map(rowPosts => rowPosts.map(post => (   
                                            <PostPreview key={`${post.id}-${Date.now()}`} post={post} admin={true}/>   
                                        )))}
                                    </div>
                                ) }
                            </Suspense>

                    </section>
                    <section className="ba-all-posts">
                        <h2>Postagens publicadas:</h2>

                        <Suspense fallback={<div></div>}>
                            { isSmallScreen && (
                                <>
                                    {publishedPosts.map(post => (
                                        <PostPreview key={`${post.id}-${Date.now()}`} post={post} admin={true}/>
                                    ))}
                                </>
                                ) }

                            { isSmallScreen || (
                                <div className="ba-published-posts-rows">
                                    {publishedPosts.map(rowPosts => rowPosts.map(post => (   
                                        <PostPreview key={`${post.id}-${Date.now()}`} post={post} admin={true}/>   
                                    )))}
                                </div>
                            ) }
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