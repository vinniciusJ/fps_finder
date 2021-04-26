import React from 'react'

import './styles.css'

const FPSInput = props => {
    const { id, selectedGame = 0, games, fps_average, onSelect, onKeyUp, onDelete, classOption } = props

    return (
       <div className='fps-input-container'>
            <div data-id={id} className={`fps-input ${classOption ?? ''}`}>

                <label htmlFor={`fps_average_select-${id}`}></label> 

                <select name="game" id={`fps_average_select-${id}`} onChange={onSelect}>
                        <option value={0}>Escolha um jogo </option>

                        {games.map(game => (
                            <option key={game.id} selected={selectedGame === game.id} value={game.id}>{game.name}</option>
                        ))}

                </select>

                <div className="input-container">
                    <input 
                        defaultValue={fps_average} 
                        name='fps_average'
                        id={`fps_average_input-${id}`}
                        required
                        type='number'
                        placeholder='FPS' 
                        onChange={onKeyUp}
                    />
                </div>

                <button onClick={onDelete} type='button' className="delete-fps-average"> X </button>
            </div>

            { classOption && <p>Este jogo já foi selecionado</p>}

       </div> 
    )
}

export default FPSInput