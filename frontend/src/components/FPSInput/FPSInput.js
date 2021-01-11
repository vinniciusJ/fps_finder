import React from 'react'

import Input from '../Input/Input'

import './styles.css'

const FPSInput = props => {
    const { id, options, selectValue, inputValue, handleSelect, handleInput, deleteInput = () => {}, isDuplicated = false } = props

    return (
       <div className='fps-input-container'>
            <div data-id={id} className={isDuplicated ? "fps-input duplicated" : "fps-input"}>
                <select name="game" id="game" defaultValue={selectValue} onChange={handleSelect}>
                    <option value={0}>Escolha um jogo </option>
                    {options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
                <Input value={inputValue} name='fps_average' type='number' isRequired={true} placeholder='FPS' onKeyUp={handleInput}/>
                <button onClick={deleteInput} type='button' className="delete-fps-average">
                    X
                </button>
            </div>
            { isDuplicated && <p>Este jogo já foi selecionado</p>}
       </div> 
    )
}

export default FPSInput