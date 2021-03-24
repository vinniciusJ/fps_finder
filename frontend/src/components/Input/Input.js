import React from 'react'

import './styles.css'

const Input = props => {
    const { id, label, name, type = 'text', placeholder = 'Digite aqui...', isRequired, onKeyUp, value } = props

    return (
        <div className="input-container">
            {label && <label htmlFor={id}>{label}: </label>}
            <input defaultValue={value} name={name} id={id} required={isRequired} type={type} placeholder={placeholder} onChange={onKeyUp}/>
        </div>
    )
}

export default Input