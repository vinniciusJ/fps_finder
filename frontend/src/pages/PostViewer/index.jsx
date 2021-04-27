import { useParams } from 'react-router'
import { blogAPI } from '../../services/api'
import { convertFromRaw, EditorState } from 'draft-js'
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

const Menu = lazy(() => import('../../components/Menu/'))
const Footer = lazy(() => import('../../components/Footer/'))
const PostContent = lazy(() => import('../../components/PostContent/'))

const PostViewer = () => {
    const { slug } = useParams(), postURL = `https://fpsfinder.com/blog/post/${slug}`

    const emptyContent = EditorState.createEmpty().getCurrentContent()

    const [ post, setPost ] = useState({})

    useEffect(() => (async () => {
        if(!slug) return

        const source = axios.CancelToken.source()

        try{
            const { data } = await blogAPI(`https://fpsfinder-blog.herokuapp.com/blog/${slug}/`, { cancelToken: source.token })

            const [ date ] = data.last_edited_at.split('T')

            const lastEditedAt = moment(date).format('DD/MM/YYYY')
            const contentState = convertFromRaw(JSON.parse(data.content))
            const banner = { src: data.banner_link, font: data.font_banner }

            document.title = data.title

            console.log(JSON.parse(data.content))

            setPost({
                title: data.title,
                lastEditedAt,
                banner,
                content: contentState
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
            <main className="post-viewer-container">
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

                <Suspense fallback={<div></div>}>
                    <PostContent content={post?.content ?? emptyContent}/>
                </Suspense>
                
            </main>
            <Suspense fallback={<div></div>}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default PostViewer