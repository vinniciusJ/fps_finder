import React from 'react'
import { X } from 'react-feather'

import Input from '../Input/Input'

import { debounceEvent } from '../../utils/index'

import './styles.css'

const FPSInput = props => {
    const { options, handleSelect, handleInput, deleteInput = () => {} } = props

    return (
        <div className="fps-input">
            <select name="game" id="game" onChange={handleSelect}>
                <option value={0}>Escolha um jogo: </option>
                {options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
            <Input name='fps_average' isRequired={true} placeholder='FPS' onKeyUp={debounceEvent(handleInput)}/>
            <button onClick={deleteInput} type='button' className="delete-fps-average">
                <X width={24} strokeWidth={2} height={24}/>
            </button>
        </div>
    )
}

export default FPSInput