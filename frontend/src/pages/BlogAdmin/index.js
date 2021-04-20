import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import { blogAPI } from '../../services/api'
import { Redirect } from 'react-router-dom'
import { PostInterface } from '../../utils/interfaces.json'

import './styles.css'

const AdminMenu = lazy(() => import('../../components/AdminMenu'))
const PostPreview = lazy(() => import('../../components/PostPreview'))

const BlogAdmin = props => {
    const user = sessionStorage.getItem('user')

    const [ posts, setPosts ] = useState([])
    const [ totalPosts, setTotalPosts ] = useState(0)
    const [ savedPosts, setSavedPosts ] = useState([])
    const [ publishedPosts, setPublishedPosts ] = useState([])
    const [ featuredPost, setFeaturedPost ] = useState({ ...PostInterface })
    const [ isSmallScreen, setIsSmallScreen ] = useState(false)

    const reduceArray = array => array.reduce((rows, key, index) => (
        (index % 3 === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows
    ), [])

    const setPostsByCategory = useCallback(({ posts, screen = isSmallScreen }) => {
        const [ receivedSavedPosts, receivedPublishedPosts ] = [
            posts.filter(post => !post.published && !post.featured),
            posts.filter(post => post.published && !post.featured)
        ]

        setTotalPosts(posts.length)
        setFeaturedPost(posts.find(receivedPost => receivedPost.featured))

        if(screen){
            const [ saved, published ] = [
                reduceArray(receivedSavedPosts),
                reduceArray(receivedPublishedPosts)
            ]

            setSavedPosts(saved)
            setPublishedPosts(published)

            return 
        }

        setSavedPosts(receivedSavedPosts)
        setPublishedPosts(receivedPublishedPosts)

    }, [ isSmallScreen ])

    const handlePostFeature = async ({ target: { dataset: { id } } }) => {
        const source = axios.CancelToken.source()

        try{
            const receivedPost = await (await blogAPI.put(`/featured/${id}`, { cancelToken: source.token })).data
            
            const updatedPosts = posts.map(post => {
                if(post.id === receivedPost.id) 
                    return receivedPost
                else if(post.id === featuredPost.id)
                    return { ...featuredPost, featured: false }
                else
                    return post
            })

            setPostsByCategory({ posts: updatedPosts })
        }
        catch(error){
            alert(error.message)
        }
    }

    const handlePostSearching = ({ target: { value } }) => {
        const searcher = RegExp(`^.*(${value.toUpperCase()}).*$`)
        
        const foundCombinations = posts.filter(({ title }) => title.toUpperCase().match(searcher))

        console.log(foundCombinations)
    }

    useEffect(() => (async () => {
        const source = axios.CancelToken.source()

        try{
            const receivedPosts = await (await blogAPI.get(`/`, { cancelToken: source.token } )).data
         
            const screenStatus = window.matchMedia('(min-width: 1024px)').matches

            setPosts(receivedPosts)
            setIsSmallScreen(screenStatus)
            setPostsByCategory({ posts: receivedPosts, screen: screenStatus })
        }
        catch(error){
            alert(error.message)
        }

        return () => source.cancel("Requisição Cancelada")

    })(), [ setPostsByCategory ])


    return (
        <div className="BlogAdmin">
            {user ? (
                <>
                <Suspense fallback={<div></div>}>
                    <AdminMenu onSearch={handlePostSearching} total={totalPosts} type="post"/>
                </Suspense>
                <main className="ba-post">
                    <section className="ba-featured-post">
                        <h2>Postagem em Destaque:</h2>
                        <Suspense fallback={<div></div>}>
                            <PostPreview post={featuredPost} admin={true} onFeature={handlePostFeature}/>
                        </Suspense>
                    </section>
                    <section className="ba-saved-posts">
                        <h2>Postagens salvas:</h2>

                        <Suspense fallback={<div></div>}>
                            { isSmallScreen || (
                                    <>
                                        {savedPosts.map(post => (
                                            <PostPreview key={`${Date.now()}#${post.id}`} post={post} admin={true} onFeature={handlePostFeature}/>
                                        ))}
                                    </>
                                    ) }

                                { isSmallScreen && (
                                    <div className="ba-saved-posts-rows">
                                        {savedPosts.map((row, index) => (
                                            <div key={`${Date.now()}#${index}`} className="ba-saved-posts-row">
                                                {row.map(post => (
                                                    <PostPreview 
                                                        post={post} 
                                                        admin={true} 
                                                        onFeature={handlePostFeature}
                                                        key={`${Date.now()}#${post.id}`}  
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div> 
                                ) }
                            </Suspense>

                    </section>
                    <section className="ba-all-posts">
                        <h2>Postagens publicadas:</h2>

                        <Suspense fallback={<div></div>}>
                            { isSmallScreen || (
                                <>
                                    {publishedPosts.map(post => (
                                        <PostPreview key={`${Date.now()}#${post.id}`} post={post} admin={true} onFeature={handlePostFeature}/>
                                    ))}
                                </>
                                ) }

                            { isSmallScreen && (
                                <div className="ba-published-posts-rows">
                                    {publishedPosts.map((row, index) => (
                                        <div key={`${Date.now()}#${index}`} className="ba-published-posts-row">
                                            {row.map(post => (
                                                <PostPreview 
                                                    post={post} 
                                                    admin={true} 
                                                    onFeature={handlePostFeature}
                                                    key={`${Date.now()}#${post.id}`}  
                                                />
                                            ))}
                                        </div>
                                    ))}
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