import React, { Suspense, lazy, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { blogAPI } from '../../services/api'
import { convertFromRaw, EditorState } from 'draft-js'
import { Clock } from 'react-feather'

import { 
    FacebookShareButton, FacebookIcon,
    WhatsappShareButton, WhatsappIcon,
    TwitterShareButton, TwitterIcon
} from 'react-share'

import moment from 'moment'
import axios from 'axios'
import Loading from '../../components/Loading'

import styles from './styles.module.scss'

const Menu = lazy(() => import('../../components/Menu/'))
const Footer = lazy(() => import('../../components/Footer/'))
const PostContent = lazy(() => import('../../components/PostContent/'))
const PostPreview = lazy(() => import('../../components/PostPreview/'))

const PostViewer = () => {
    const { slug } = useParams(), postURL = `https://fpsfinder.com/blog/post/${slug}`

    const emptyContent = EditorState.createEmpty().getCurrentContent()

    const [ post, setPost ] = useState({})
    const [ isLoading, setIsLoading ] = useState(true)
    const [ latestPosts, setLatestPosts ] = useState([])

    useEffect(() => (async () => {
        if(!slug) return

        const source = axios.CancelToken.source()

        try{
            const { data } = await blogAPI(`/${slug}/`, { cancelToken: source.token })

            const [ date ] = data.last_edited_at.split('T')

            const lastEditedAt = moment(date).format('DD/MM/YYYY')
            const contentState = convertFromRaw(JSON.parse(data.content))
            const banner = { src: data.banner_link, font: data.font_banner }

            document.title = `${data.title} | Blog`

            setIsLoading(false)
            setPost({ title: data.title, lastEditedAt, banner, content: contentState })
        }
        catch(error){
            alert(error.messsage)
        }

        return () => source.cancel('Requisição cancelada')

    })(), [ slug ])

    useEffect(() => (async () => {
        const source = axios.CancelToken.source()

        try{
            const { data } = await blogAPI.get('/latest-posts/', { cancelToken: source.token })

            setLatestPosts(data)
        }
        catch(error){
            alert(error.message)
        }

        return () => source.cancel('Requisição cancelada')
    })(), [  ])
    

    return (
        <div className={styles.postViewerContainer}>
            <Suspense fallback={<div></div>}>
                <Menu searchInput={{ isVisible: false }} />
            </Suspense>

            { isLoading && <Loading /> }

            { isLoading || (
                <>
                    <main>
                        <header>
                            <h1>{post.title}</h1>
                            <div>
                                <span>
                                    <Clock color="#737373" strokeWidth={2}/>
                                    {post.lastEditedAt}
                                </span>

                                <div className={styles.socialMediaButtons}>
                                    <WhatsappShareButton url={postURL} title={post?.title ?? ""} separator={'\n'}>
                                        <WhatsappIcon size={24} round={false} />
                                    </WhatsappShareButton>
                                    <TwitterShareButton url={postURL} title={post?.title ?? ""}>
                                        <TwitterIcon size={24} round={false} />
                                    </TwitterShareButton>
                                    <FacebookShareButton url={postURL} quote={post?.title ?? ""}>
                                        <FacebookIcon size={24} round={false} />
                                    </FacebookShareButton>
                                </div>
                            </div>

                            <figure>
                                <img src={post?.banner?.src ?? ""} alt={post?.banner?.font ?? ""}/>
                                <figcaption><strong>Fonte: </strong>{ post?.banner?.font ?? "" }</figcaption>
                            </figure>
                        </header>

                        <Suspense fallback={<div></div>}>
                            <PostContent content={post?.content ?? emptyContent}/>
                        </Suspense>
                        
                    </main>
                    { latestPosts.length !== 0 && (
                        <section className={styles?.readMore ?? "" }>
                            <h2>Leia mais</h2>

                            <div className={styles?.latestPosts ?? ""}>
                                <Suspense fallback={<div></div>}>
                                    { latestPosts.map(post => (
                                        <PostPreview post={post} key={post.id}/>
                                    )) }
                                </Suspense>
                            </div>
                        </section>
                    ) }
                </>
            )}
            <Suspense fallback={<div></div>}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default PostViewer