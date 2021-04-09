import React from 'react'

const Video = ({ src }) => {
    const id = src.split('/')[src.split('/').length - 1]
    
    src = `https://www.youtube.com/embed/${id}`

    return !!src ? (
        <iframe width="560" height="315" src={`${src}?autoplay=1&mute=1`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>Oi</iframe>
    )
    : null
}

export default Video