import React, { useState, useEffect } from 'react'
import moment from 'moment'

import { Clock } from 'react-feather'
import { Link } from 'react-router-dom'

import './styles.css'

const PostPreview = ({ post }) => {
    const { title, path, content, created_at, banner_link, font_banner, featured } = post
    const [ postDescription, setPostDescription ] = useState('')
    const [ createdAtDate, setCreatedAtDate ] = useState('')

    useEffect(() => {
        const [ date ] = created_at.split('T')
        const formatedDate = moment(date).format('DD/MM/YYYY')

        setCreatedAtDate(formatedDate)
        setPostDescription(JSON.parse(content).blocks[0].text)
    }, [ content, created_at ])

    return (
        <Link to={`/blog/post/${path}`} className={`blog-post-preview ${featured ? 'featured': ' '}`}>
            <img src={banner_link} alt={font_banner}/>

            <section className="post-preview-data">
                <h2>{title}</h2>

                {featured && <p>{postDescription}</p> }

                <span className="post-timestamp">
                    <Clock color='#737373' strokeWidth={2}/> {createdAtDate}
                </span>
            </section>
        </Link>
    )
}

export default PostPreview