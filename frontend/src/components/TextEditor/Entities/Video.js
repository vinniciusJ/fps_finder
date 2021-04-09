import React from 'react'

const Video = ({ src }) => {
    return !!src ? (
        <iframe width="100%" height="448px" src={`${src}?autoplay=1&mute=1`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>Oi</iframe>
    )
    : null
}

export default Video