import React from 'react'

import './styles.css'

const Image = ({ src, font }) => !!src ? (
    <figure className="editor-img-container">
        <img width={320} height={180} src={src} alt={font}/>
        <figcaption><strong>Fonte: </strong>{font}</figcaption>
    </figure>
) : null

export default Image