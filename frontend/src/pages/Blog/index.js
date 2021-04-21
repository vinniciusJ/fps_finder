import { Suspense, lazy, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlertCircle } from 'react-feather'
import { parseArrayToMatrices, createSearcher } from '../../utils'
import { blogAPI } from '../../services/api'

import axios from 'axios'

import './styles.css'

const Menu = lazy(() => import('../../components/Menu/'))
const PostPreview = lazy(() => import('../../components/PostPreview'))
const Footer = lazy(() => import('../../components/Footer/Footer'))

const Blog = () => {
    const [ posts, setPosts ] = useState([])
    const [ latestPosts, setLatestPosts ] = useState([])
    const [ featuredPost, setFeaturedPost ] = useState({})


    const [ searchFor, setSearchFor ] = useState('')
    const [ foundPosts, setFoundPosts ] = useState([])
    const [ isSearching, setIsSearching ] = useState(false)    
    const [ noPostsFound, setNoPostsFound ] = useState(false)

    const handleSearch = ({ target: { value } }) => {
        const searcher = createSearcher({ value })

        if(!value) {
            setNoPostsFound(false)
            setSearchFor('')
        }

        setIsSearching(value ? true : false)

        if(value){
            let foundPosts = posts.flat().filter(({ title }) => title.toUpperCase().match(searcher))

            setSearchFor(value)
            setFoundPosts(foundPosts)
            setNoPostsFound(foundPosts.length ? false : true) 
        }
    }

    useEffect(() => (async () => {
        const source = axios.CancelToken.source()

        try{
            const receivedPosts = await (await blogAPI.get('/', { cancelToken: source.token })).data

            const featured = receivedPosts.find(post => post.featured)
            const filteredPosts = receivedPosts.filter(post => !post.featured)

            const [ st, nd, rd, ...all ] = filteredPosts.sort(
                ( fs, nd ) => Date.parse(nd.last_edited_at) - Date.parse(fs.last_edited_at)
            )
   
            setFeaturedPost(featured)
            setLatestPosts([ st, nd, rd ])        
            
            setPosts(parseArrayToMatrices(all))
        }
        catch(error){
            alert(error.message)
        }

        return () => source.cancel('Requisição foi cancelada')
    })(), [])


    return (
        <div className="Blog">
            <Suspense fallback={<div></div>}>
                <Menu 
                    searchInput={{ isVisible: true }}
                    onSearch={handleSearch}
                />
            </Suspense>
            <main className="blog-posts">
               { isSearching || (
                    <>
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
                                        <PostPreview key={`${Date.now}#${post.id}`} post={post}/>
                                    ))}
                                </Suspense>
                            </div>
                            
                        </section>
                        <section className="blog-all-posts">
                            <h1 className="blog-title">Todos as postagens:</h1>
   
                            {posts.map((values, index) => (
                                <div key={index} >
                                    {values.map(post => (
                                        <Suspense key={`${Date.now}#${post.id}`} fallback={<div></div>}>
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
                    </>
               ) }

               { isSearching && (
                   <section className="blog-found-posts">
                       <h1 className="blog-title">Resultados para <span>"{searchFor}"</span> :</h1>

                        { noPostsFound || (
                            <Suspense fallback={<div></div>}>
                                {foundPosts.map(post => (
                                    <PostPreview key={`${Date.now}#${post.id}`} post={post} isOnSearch={true}/>
                                ))}
                            </Suspense>
                        ) }

                        { noPostsFound && (
                            <div className="no-post-found">
                                <AlertCircle width={96} height={96} color='#E7E6E6'/>
                                <p> Nenhuma postagem foi encontrada</p>
                            </div>
                        ) }
                   </section>
               ) }
            </main>
            <Suspense fallback={<div></div>}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default Blog