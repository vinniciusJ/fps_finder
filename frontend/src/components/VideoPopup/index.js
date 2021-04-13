import React, { useState, useEffect } from 'react'

import './styles.css'

const VideoPopup = ({ videoRef, onClick, onCancel }) => {
    const [ popupPosition, setPopupPosition ] = useState({ top: 0 })
    const [ currentVideo, setCurrentVideo ] = useState(null)

    useEffect(() => setPopupPosition({ top: window.pageYOffset }), [])

    const handleVideoPreview = ({ target: { value: src} }) => {
        const id = src.split('/')[src.split('/').length - 1]

        setCurrentVideo(`https://www.youtube.com/embed/${id}`)
    }

    return(
        <div style={popupPosition} className="add-video-popup">
            <div className="add-video-popup-inner">
                <header className="avp-header">
                    <h2>Inserir video:</h2>
                </header>
                <main className="avp-video-input">
                    <label htmlFor="video"></label>
                    <input ref={videoRef} type="url" name="video" id="video" placeholder="Insira o link do vídeo do youtube aqui" onChange={handleVideoPreview}/>

                    { currentVideo && (
                        <iframe width="560" height="315" src={`${currentVideo}?autoplay=1&mute=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    ) }
                </main>
                <footer className="avp-buttons">
                    <button className="btn main" onClick={onClick}>Inserir</button>
                    <button className="btn" onClick={onCancel}>Cancelar</button>
                </footer>
            </div>
        </div>
    )
}

export default VideoPopup