import React from 'react'

import helpIcon from '../../assets/images/help.svg'

import './styles.css'

const SelectInput = (props) => {
    const { label, selectedOption, options, handleSelectChange, handlePopUp, popUpID, id } = props

    return (
        <div className="select-container">
            <section className="select-header">
                <h2><label htmlFor={id}>{label}</label></h2>
                <button onClick={handlePopUp}>
                    <img width={22} height={22} src={helpIcon} alt={label} id={popUpID}/>
                </button>
            </section>
            <section className="select-input">

                <select id={id} value={selectedOption ?? 0} onChange={handleSelectChange}>
                    <option key={0} value={0}>Selecione</option>
                    {options.map((option,index) => <option key={index + 1} value={option}>{option}</option>)}
                </select>
            </section>
        </div>
    )
}

export default SelectInput