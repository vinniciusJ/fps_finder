import React from 'react'

import './styles.css'

const Input = props => {
    const { label, name, type = 'text', placeholder = 'Digite aqui...', isRequired, onKeyUp, value } = props

    return (
        <div className="input-container">
            {label && <label htmlFor={name}>{label}: </label>}
            <input value={value && value} name={name} required={isRequired} type={type} placeholder={placeholder} onChange={onKeyUp}/>
        </div>
    )
}

export default Input