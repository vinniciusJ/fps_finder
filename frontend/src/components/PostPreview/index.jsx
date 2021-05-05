import { useState, useEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MoreHorizontal, Heart, X, Edit3 } from 'react-feather'

import moment from 'moment'

import './styles.css'

const DeletePopUp = lazy(() => import('../DeletePopUp/'))

const PostPreview = ({ post, admin, onFeature, isOnSearch = false }) => {
    const { id, title, slug, content, last_edited_at, banner_link, font_banner, featured } = post

    const [ postDescription, setPostDescription ] = useState('')
    const [ createdAtDate, setCreatedAtDate ] = useState('')
    const [ moreOptions, setMoreOptions ] = useState(false)

    const [ isDelPopupVisible, setIsDelPopupVisible ] = useState(false)

    const className = `
        blog-post-preview ${(featured && !isOnSearch) ? 'featured': (isOnSearch ? 'onSearch': ' ')}
    `

    useEffect(() => {
        if(!id) return

        const [ date ] = last_edited_at.split('T')
        const formatedDate = moment(date).format('DD/MM/YYYY')

        setCreatedAtDate(formatedDate)
        setPostDescription(JSON.parse(content).blocks[0].text)
        
    }, [ id, content, last_edited_at ])

    const handleMoreOptionsVisibility = () => setMoreOptions(!moreOptions)

    const handleDelPopupVisibility = () => {
        setMoreOptions(false)
        setIsDelPopupVisible(!isDelPopupVisible)
    }

    return (
        <div style={{ position: (isDelPopupVisible ? 'initial' : 'relative') }} className="post-preview-container">
            { admin && (
                    <div className="three-dots-container">
                        <span className="td" onClick={handleMoreOptionsVisibility}
                        ><MoreHorizontal width={32} height={32}/></span>

                        {moreOptions && (
                            <div className="td-opts">
                                <Link to={`/post/${id}`}>
                                    <Edit3 /> Editar
                                </Link>
                                <button onClick={onFeature} data-id={id} disabled={featured ? true : false}>
                                    <Heart color={featured ? "#9776FF" : "#000"} fill={featured ? "#9776FF" : "transparent"}/> Destaque
                                </button>
                                <button onClick={handleDelPopupVisibility}>
                                    <X /> Deletar
                                </button>
                            </div>
                        )}
                    </div>
                ) }
            <Link to={`/blog/post/${slug}#`} className={className} >
                <img src={banner_link} alt={font_banner}/>

                <section className="post-preview-data">
                    <h2>{title}</h2>

                    {(featured || isOnSearch) && <p>{postDescription}</p> }

                    <span className="post-timestamp">
                        <Clock color='#737373' strokeWidth={2}/> {createdAtDate}
                    </span>
                </section>
            </Link>

            { (admin && isDelPopupVisible) && (
                <Suspense fallback={<div></div>}>
                    <DeletePopUp
                        id={id} 
                        type="post"
                        confirmText={title}
                        handleVisibility={handleDelPopupVisibility}
                    />
                </Suspense>
            )}
        </div>
    )
}

export default PostPreview