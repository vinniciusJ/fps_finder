import React from 'react'

const Video = ({ src }) => {
    return !!src ? (
        <iframe width="100%" height="448px" src={`${src}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>Oi</iframe>
    )
    : null
}

export default Video