import React from 'react'

import Input from '../Input/Input'

import './styles.css'

const FPSInput = props => {
    const { id, options, handleSelect, handleInput, deleteInput = () => {}, isDuplicated = false } = props

    return (
       <div className='fps-input-container'>
            <div className={isDuplicated ? "fps-input duplicated" : "fps-input"}>
                <select name="game" id="game" onChange={handleSelect} data-id={id}>
                    <option value={0}>Escolha um jogo: </option>
                    {options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
                <Input name='fps_average' isRequired={true} placeholder='FPS' onKeyUp={handleInput}/>
                <button data-id={id} onClick={deleteInput} type='button' className="delete-fps-average">
                    X
                </button>
            </div>
            { isDuplicated && <p>Este jogo já foi selecionado</p>}
       </div> 
    )
}

export default FPSInput