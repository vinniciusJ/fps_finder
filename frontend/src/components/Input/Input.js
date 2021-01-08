import React from 'react'

import './styles.css'

const Input = props => {
    const { label, name, type = 'text', placeholder = 'Digite aqui...', isRequired, onKeyUp } = props

    return (
        <div className="input-container">
            {label && <label htmlFor={name}>{label}: </label>}
            <input name={name} required={isRequired} type={type} placeholder={placeholder} onKeyUp={onKeyUp}/>
        </div>
    )
}

export default Input