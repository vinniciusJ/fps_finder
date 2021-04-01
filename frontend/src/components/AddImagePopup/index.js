import React, { useState, useRef } from 'react'

import './styles.css'

const AddImagePopup = props => {
    const { isThereAnImage = false, onChangeImage, onFontInput } = props

    const [ inputType, setInputType ] = useState('upload')
    
    const imageInputButton = useRef(null)

    const toggleInputType = ({ target: { value } }) => setInputType(value)
    const triggerButton = () => imageInputButton.current.click()

    return (
        <div className="add-image-popup">
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
                            <input type="url" id="img-url" name="img-url" placeholder="Cole a URL aqui..." onChange={onChangeImage}/>
                         </div>
                    ) }

                    { (inputType === 'upload') && (
                        <div className="aip-input-container">
                            <label htmlFor="img-upload"></label>
                            <input ref={imageInputButton} type="file" id="img-upload" name="img-upload" hidden onChange={onChangeImage}/>
                            
                            <div className="input-trigger">

                                <button className="img-upload-btn" onClick={triggerButton}>
                                    Escolher imagem
                                </button>

                                <p>{ isThereAnImage ? 'Uma imagem selecionada' : 'Nenhuma imagem selecionada' }</p>
                            </div>
                        </div>
                    ) }

                    <div className="aip-input-container">
                        <label htmlFor="font">Fonte da imagem:</label>
                        <input type="text" id="font" name="font" placeholder="Escreva aqui..." onChange={onFontInput}/>
                    </div>
                </main>
                <footer className="aip-footer">
                    <button className="btn main">Inserir</button>
                    <button className="btn">Cancelar</button>
                </footer>
            </div>
        </div>
    )
}

export default AddImagePopup