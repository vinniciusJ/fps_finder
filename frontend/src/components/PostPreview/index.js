import React, { useState, useEffect } from 'react'
import moment from 'moment'

import { Link } from 'react-router-dom'
import { Clock, MoreHorizontal, Heart, X, Edit3 } from 'react-feather'

import './styles.css'

const PostPreview = ({ post, admin, onFeature, onDelete }) => {
    const { id, title, slug, content, last_edited_at, banner_link, font_banner, featured } = post
    const [ postDescription, setPostDescription ] = useState('')
    const [ createdAtDate, setCreatedAtDate ] = useState('')
    const [ moreOptions, setMoreOptions ] = useState(false)

    useEffect(() => {
        if(!id) return

        const [ date ] = last_edited_at.split('T')
        const formatedDate = moment(date).format('DD/MM/YYYY')

        setCreatedAtDate(formatedDate)
        setPostDescription(JSON.parse(content).blocks[0].text)
        
    }, [ id, content, last_edited_at ])

    const handleMoreOptionsVisibility = () => setMoreOptions(!moreOptions)

    return (
        <div className="post-preview-container">
            { admin && (
                    <div className="three-dots-container">
                        <span className="td" onClick={handleMoreOptionsVisibility}
                        ><MoreHorizontal width={32} height={32}/></span>

                        {moreOptions && (
                            <div className="td-opts">
                                <Link to={`/post/${id}`}>
                                    <Edit3 /> Editar
                                </Link>
                                <button onClick={onFeature}>
                                    <Heart /> Destaque
                                </button>
                                <button onClick={onDelete}>
                                    <X /> Deletar
                                </button>
                            </div>
                        )}
                    </div>
                ) }
            <Link to={`/blog/post/${slug}`} className={`blog-post-preview ${featured ? 'featured': ' '}`}>
                
                <img src={banner_link} alt={font_banner}/>

                <section className="post-preview-data">
                    <h2>{title}</h2>

                    {featured && <p>{postDescription}</p> }

                    <span className="post-timestamp">
                        <Clock color='#737373' strokeWidth={2}/> {createdAtDate}
                    </span>
                </section>
            </Link>
        </div>
        
    )
}

export default PostPreview