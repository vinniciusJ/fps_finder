import { Suspense, lazy, useState, useEffect } from 'react'
import { parseArrayToMatrices } from '../../utils'
import { AlertCircle } from 'react-feather'
import { blogAPI } from '../../services/api'

import axios from 'axios'

import './styles.css'

const Menu = lazy(() => import('../../components/Menu/'))
const PostPreview = lazy(() => import('../../components/PostPreview/'))
const Footer = lazy(() => import('../../components/Footer/'))
const Loading = lazy(() => import('../../components/Loading'))

const Blog = () => {
    const [ postsByPage, setPostsByPage ] = useState({ 1: [] })
    const [ latestPosts, setLatestPosts ] = useState([])
    const [ featuredPost, setFeaturedPost ] = useState({})

    const [ isLoading, setIsLoading ] = useState(true)

    const [ pages, setPages ] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageButtons, setPageButtons ] = useState({
        first: 0, previous: 0, showingButtons: [], next: 0, last: 0
    }) 

    const [ searchFor, setSearchFor ] = useState('')
    const [ foundPosts, setFoundPosts ] = useState([])
    const [ isSearching, setIsSearching ] = useState(false)    
    const [ noPostsFound, setNoPostsFound ] = useState(false)

    const handleSearch = ({ target: { value } }) => setSearchFor(value)

    const defineShowingButtons = ({ page }) => {
        if(page === 1) 
            return [ page, (page + 1), (page + 2) ]
        if(page === pages[pages.length - 1].index)
            return [ (page - 2), (page - 1), page ]
        
        return [ (page - 1), page, (page + 1) ]
    }

    const handlePagination = async ({ target }) => {
        const source = axios.CancelToken.source()

        try{
            const value = target.value || target.parentElement.value, page = Number(value.split('=')[1])
            const newShowingButtons = defineShowingButtons({ page }).map(page => ({ index: (page ), page: `/?page=${page}`}))
    
            if(page === 1) {
                setPageButtons({ 
                    first: pageButtons.first,
                    previous: `/?page=${page}`, 
                    showingButtons: newShowingButtons, 
                    next: `/?page=${page + 1}`, 
                    last: pageButtons.last
                })

            }
            else if(page === pages[pages.length - 1].index) {
                setPageButtons({ 
                    first: pageButtons.first,
                    previous: `/?page=${page - 1}`, 
                    showingButtons: newShowingButtons,
                     next: `/?page=${page}`, 
                     last: pageButtons.last
                })
            }
            else{            
                setPageButtons({ 
                    first: pageButtons.first,
                    previous: `/?page=${page - 1}`,
                    showingButtons: newShowingButtons,
                    next: `/?page=${page + 1}`,
                    last: pageButtons.last
                })
            }
    
            if(!postsByPage[page]){
                setIsLoading(true)

                const { data: { results } } = await blogAPI.get(`/?page=${page}`, { cancelToken: source.token })
                const posts = parseArrayToMatrices(results)

                setPostsByPage({ ...postsByPage, [page]: posts })
            }

            setIsLoading(false)
            setCurrentPage(page)
        }
        catch(error){
            alert(error.message)
        }

        return () => source.cancel('Requisição foi cancelada')
    }

    useEffect(() => (async () => {
        const source = axios.CancelToken.source()

        document.title = 'Blog | FPS Finder'

        try{
            const { data: page } = await blogAPI.get(`/?page=1`, { cancelToken: source.token })
            const { data: receivedFeaturedPost } = await blogAPI.get('/featured/', { cancelToken: source.token })
            const { data: receivedLatestPosts } = await blogAPI.get('/latest-posts/', { cancelToken: source.token })

            const { count, results } = page, allpages = [], paginatedPosts = parseArrayToMatrices([...results])

            for(let i = 1; i <= Math.ceil(count / 9); i++) 
                allpages.push({ index: i, page: `/?page=${i}` })

            const firstPagePosts = { 1 : paginatedPosts }

            setPages(allpages)
            setIsLoading(false)
            setPostsByPage(firstPagePosts)
            setLatestPosts(receivedLatestPosts)
            setFeaturedPost(receivedFeaturedPost)
        }
        catch(error){
            alert(error.message)
        }

        return () => source.cancel('Requisição foi cancelada')

    })(), [ ])

    useEffect(() => {
        if(!pages.length) return

        const [ { page: first }, { page: last } ] = [ pages[0], pages[pages.length - 1] ]
        const showingButtons = pages.slice(0, 3)

        const [ previousIndex, nextIndex ] = [ 
            showingButtons[0].index , 
            showingButtons[showingButtons.length - 1].index 
        ]

        const [ previous, next ] = [ `/?page=${previousIndex}`, `/?page=${nextIndex + 1}` ]

        setPageButtons({ first, previous, showingButtons, next, last })
    }, [ pages ])

    useEffect(() => (async () => {
        if(!searchFor) {
            setIsSearching(false)
            setNoPostsFound(false)

            return
        }

        try{
            const { data } = await blogAPI.get(`/?search=${searchFor}`)

            setFoundPosts(data)
            setIsSearching(true)
            setNoPostsFound(data.length)
        }
        catch(error){
            alert(error.message)
        }

    })(), [ searchFor ])

    return (
        <div className="Blog">
            {window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
            <Suspense fallback={<div></div>}>
                <Menu 
                    searchInput={{ isVisible: true }}
                    onSearch={handleSearch}
                />
            </Suspense>

            { isLoading && (
                <Suspense fallback={<div></div>}>
                    <Loading />
                </Suspense>
            ) }

            { isLoading || (
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
                                <h1 className="blog-title">Todas as postagens:</h1>
    
                                
                                {postsByPage[currentPage].map((values, index) => (
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
                            
                                <button 
                                    value={pageButtons.first} 
                                    onClick={handlePagination}
                                >
                                    <img src="/images/go-to-first.svg" alt="Voltar à primeira página"/>
                                </button>
                                <button 
                                    value={pageButtons.previous} 
                                    onClick={handlePagination}
                                >
                                    <img src="/images/go-to-previous.svg"alt="Voltar à pagina anterior"/>
                                </button>

                                { pageButtons.showingButtons.map(showingBtn => (
                                    <button 
                                        className={ currentPage === showingBtn.index ? 'active' : '' } 
                                        key={showingBtn.index} 
                                        value={showingBtn.page}
                                        onClick={handlePagination}
                                    >
                                        {showingBtn.index}
                                    </button>
                                )) }

                                <button 
                                    value={pageButtons.next} 
                                    onClick={handlePagination}
                                >
                                    <img src="/images/go-to-next.svg" alt="Ir para próxima página"/>
                                </button>
                                <button 
                                    value={pageButtons.last} 
                                    onClick={handlePagination}
                                >
                                    <img src="/images/go-to-last.svg" alt="Ir para última página"/>
                                </button>
                            </div>
                        </>
                ) }

                { isSearching && (
                    <section className="blog-found-posts">
                        <h1 className="blog-title">Resultados para <span>"{searchFor}"</span> :</h1>

                            { noPostsFound !== 0 && (
                                <Suspense fallback={<div></div>}>
                                    {foundPosts.map(post => (
                                        <PostPreview key={`${Date.now}#${post.id}`} post={post} isOnSearch={true}/>
                                    ))}
                                </Suspense>
                            ) }

                            { noPostsFound === 0 && (
                                <div className="no-post-found">
                                    <AlertCircle width={96} height={96} color='#E7E6E6'/>
                                    <p> Nenhuma postagem foi encontrada</p>
                                </div>
                            ) }
                    </section>
                ) }
                </main>
            ) }
            
            <Suspense fallback={<div></div>}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default Blog