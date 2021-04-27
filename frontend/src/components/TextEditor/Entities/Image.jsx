import React from 'react'

import './styles.css'

const Image = ({ src, font }) => {
    return !!src ? (
        <>
            <img className="editor-img-container" width={320} height={180} src={src} alt={font}/>
            <figcaption className="editor-caption-container"><strong>Fonte: </strong>{font}</figcaption>
        </>
    ) : null
}

export default Image