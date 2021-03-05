import React from 'react'

import helpIcon from '../../assets/images/help.svg'

import './styles.css'

const SelectInput = (props) => {
    const { label, selectedOption, options, handleSelectChange, handlePopUp, popUpID } = props

    return (
        <div className="select-container">
            <section className="select-header">
                <h2>{label}</h2>
                <button onClick={handlePopUp}>
                    <img width={20.8} height={2.8} src={helpIcon} alt={label} id={popUpID}/>
                </button>
            </section>
            <section className="select-input">
                <select value={selectedOption} onChange={handleSelectChange}>
                    <option key={0} value={0}>Selecione</option>
                    {options.map((option,index) => <option key={index + 1} value={option}>{option}</option>)}
                </select>
            </section>
        </div>
    )
}

export default SelectInput