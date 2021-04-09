import React, { useState, useRef, useEffect } from 'react'

import './styles.css'

const AddImagePopup = ({ image = {}, onChangeImage, onFontInput, onSave, onCancel }) => {
    const [ inputType, setInputType ] = useState(image.type === 'uploaded' ? 'upload' : 'url')
    const [ position, setPosition ] = useState({ top: 0 })
    const [ currentImage, setCurrentImage ] = useState(image)

    const uploadInput = useRef(null)

    useEffect(() => setPosition({ top: window.pageYOffset }), [])

    const handleImagePreview = event => {
        const { target: { value, files, type } } = event

        if(type === 'url'){
            setCurrentImage({ src: value, type: 'pasted' })
            onChangeImage({ src: value, type: 'pasted' })
        }
        else{
            const reader = new FileReader()
            const [ file ] = files
    
            reader.readAsDataURL(file)

            reader.onload = ({ target: { result } }) => {
                setCurrentImage({ src: result, type: 'uploaded' })
                onChangeImage({ src: result, type: 'uploaded' })
            }
        }
    }

    const toggleInputType = ({ target: { value } }) => setInputType(value)
    const triggerButton = () => uploadInput.current.click()

    return (
        <div style={position} className="add-image-popup">
            <div className="add-image-popup-inner">
                <header className="aip-header">
                    <h2>Inserir imagem:</h2>
                </header>
                <div className="aip-insert-types">
                    <button className={`aip-insert-type ${inputType === 'url' ? 'active' : ''}`} value="url" onClick={toggleInputType}>
                        Colar URL de uma imagem
                    </button>
                    <button className={`aip-insert-type ${inputType === 'upload' ? 'active' : ''}`} value="upload" onClick={toggleInputType}>
                        Fazer upload de uma imagem
                    </button>
                </div>
                <main className="aip-insert-inputs">
                    { (inputType === 'url') && (
                         <div className="aip-input-container">
                            <label htmlFor="img-url"></label>
                            <input 
                                type="url" 
                                id="img-url" 
                                name="img-url" 
                                value={currentImage.type === 'pasted' ? currentImage.src : ''}
                                placeholder="Cole a URL aqui..." 
                                onChange={handleImagePreview}
                            />
                         </div>
                    ) }

                    { (inputType === 'upload') && (
                        <div className="aip-input-container">
                            <label htmlFor="img-upload"></label>
                            <input ref={uploadInput} type="file" id="img-upload" name="img-upload" hidden onChange={handleImagePreview}/>
                            
                            <div className="input-trigger">

                                <button className="img-upload-btn" onClick={triggerButton}>
                                    Escolher imagem
                                </button>

                                <p>{ image.type === 'uploaded' ? 'Uma imagem selecionada' : 'Nenhuma imagem selecionada' }</p>
                            </div>
                        </div>
                    ) }

                    { (currentImage.type === 'pasted' && inputType === 'url')  && (
                        <div className="aip-img-preview-container">
                            <img src={currentImage.src} alt="Preview da currentImagem selecionada" width={320} height={180} className="aip-img-preview"/>
                        </div>
                    ) }

                    { (currentImage.type === 'uploaded' && inputType === 'upload')  && (
                        <div className="aip-img-preview-container">
                            <img src={currentImage.src} alt="Preview da imagem selecionada" width={320} height={180} className="aip-img-preview"/>
                        </div>
                    ) }


                    <div className="aip-input-container">
                        <label htmlFor="font">Fonte da imagem:</label>
                        {inputType === 'url' && (
                            <input 
                                type="text" 
                                id="font" 
                                name="font" 
                                value={currentImage.type === 'pasted' ? currentImage.font : ''}
                                placeholder="Escreva aqui..." 
                                onChange={onFontInput}
                            />
                        )}
                        {inputType === 'upload' && (
                            <input 
                                type="text" 
                                id="font" 
                                name="font" 
                                value={currentImage.type === 'uploaded' ? currentImage.font : ''}
                                placeholder="Escreva aqui..." 
                                onChange={onFontInput}
                            />
                        )}
                    </div>
                </main>
                <footer className="aip-footer">
                    <button className="btn main" onClick={onSave}>Inserir</button>
                    <button className="btn" onClick={onCancel}>Cancelar</button>
                </footer>
            </div>
        </div>
    )
}

export default AddImagePopup