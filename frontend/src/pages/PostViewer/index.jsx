import { useParams } from 'react-router'
import { blogAPI } from '../../services/api'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Clock } from 'react-feather'

import { 
    FacebookShareButton, FacebookIcon,
    WhatsappShareButton, WhatsappIcon,
    TwitterShareButton, TwitterIcon
} from 'react-share'

import moment from 'moment'
import axios from 'axios'

import './styles.css'

const Menu = lazy(() => import('../../components/Menu'))
const Footer = lazy(() => import('../../components/Footer/'))

const PostViewer = () => {
    const { slug } = useParams()

    const [ post, setPost ] = useState({})

    const postURL = `https://fpsfinder.com/blog/post/${slug}`


    useEffect(() => (async () => {
        if(!slug) return

        const source = axios.CancelToken.source()

        try{
            const { data } = await blogAPI(`https://fpsfinder-blog.herokuapp.com/blog/${slug}/`, { cancelToken: source.token })

            const [ date ] = data.last_edited_at.split('T')
            const lastEditedAt = moment(date).format('DD/MM/YYYY')

            const banner = { src: data.banner_link, font: data.font_banner }

            document.title = data.title

            setPost({
                title: data.title,
                lastEditedAt,
                banner,
                content: data.content
            })
        }
        catch(error){
            alert(error.messsage)
        }

        return () => source.cancel('Requisição cancelada')

    })(), [ slug ])

    return (
        <div className="PostViewer">
            <Suspense fallback={<div></div>}>
                <Menu searchInput={{ isVisible: false }} />
            </Suspense>
            <main className="post-viewer-content">
                <header className="post-viewer-header">
                    <h1>{post.title}</h1>
                    <div>
                        <span>
                            <Clock color="#737373" strokeWidth={2}/>
                            {post.lastEditedAt}
                        </span>

                        <div className="social-media-share-btns">
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

                
            </main>
            <Suspense fallback={<div></div>}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default PostViewer