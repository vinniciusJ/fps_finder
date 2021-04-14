import React, { useState, useEffect } from 'react'

import { Clock } from 'react-feather'
import { Link } from 'react-router-dom'

import './styles.css'

const PostPreview = ({ post }) => {
    const { title, path, featured, banner, bannerFont, content } = post
    const [ postDescription, setPostDescription ] = useState('')

    useEffect(() => {
        setPostDescription(JSON.parse(content).blocks[0].text)
    }, [ content ])

    return (
        <Link to={`/blog/post/${path}`} className="blog-post-preview featured">
            <img src={banner} alt={bannerFont}/>

            <section className="post-preview-data">
                <h2>{title}</h2>

                {featured && <p>{postDescription}</p> }

                <span className="post-timestamp">
                    <Clock color='#737373' strokeWidth={2}/> 16/03/2021
                </span>
            </section>
        </Link>
    )
}

export default PostPreview