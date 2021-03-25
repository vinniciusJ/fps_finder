import React from 'react'

import './styles.css'

const ComponentInput = props => {
    const { idComp, idCompLink, name, label, value, link, singleInput, onChange = () => {} } = props

    return (
        <div className="component-input-container">
            <section className="component-main-sec">
                <label htmlFor={idComp}>{`${label}`} </label>

                <input 
                    id={idComp} 
                    name={name} 
                    type="text" 
                    placeholder="Escreva aqui" 
                    defaultValue={value} 
                    required
                    onChange={onChange}
                />

            </section>
            { !singleInput && (
                <section className="component-link-sec">
                    <label htmlFor={idCompLink}>Onde comprar (URL): </label>
                    
                    <input 
                        id={idCompLink} 
                        name={`${name}_link`} 
                        type="url" 
                        defaultValue={link} 
                        placeholder="Cole aqui"
                        onChange={onChange}
                    />

                </section>
            )}
        </div>
    )
}

export default ComponentInput