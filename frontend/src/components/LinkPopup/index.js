import React, { useState, useEffect } from 'react'

import { Check } from 'react-feather'

import './styles.css'

const LinkPopup = () => {
    const [ popupsPosition, setPopupsPosition ] = useState({ top: 0 })

    useEffect(() => setPopupsPosition({ top: window.pageYOffset }), [])

    return (
        <div style={popupsPosition} className="add-link-popup">
            <div className="add-link-popup-inner">
                <header className="alp-header">
                    <h2>Inserir link:</h2>
                </header>
                <main className="alp-link-input">
                    <label htmlFor="url">
                        <input type="url" name="url" id="url" placeholder="Digite a URL aqui..."/>
                    </label>
                    <div className="checkbox-container">
                        <span><input type="checkbox" name="checkbox" id="checkbox"/>
                        <span className="checked"><Check color="#9776FF"/></span></span>
                        <label htmlFor="target">Abrir em uma nova aba.</label>
                    </div>
                    
                </main>
                <footer className="alp-buttons">
                    <button className="btn main">Aplicar</button>
                    <button className="btn">Cancelar</button>
                </footer>
            </div>
        </div>
    )
}

export default LinkPopup