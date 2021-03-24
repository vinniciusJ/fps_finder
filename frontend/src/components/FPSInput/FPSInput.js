import React, { Suspense, lazy } from 'react'

import './styles.css'

const Input = lazy(() => import('../Input/Input'))

const FPSInput = props => {
    const { id_game, games, fps_average, onSelect, onKeyUp, onDelete, classOption } = props

    return (
       <div className='fps-input-container'>
            <div data-id_game={id_game} className={`fps-input ${classOption ?? ''}`}>

                <select name="game" id="game" onChange={onSelect}>
                    <option value={0}>Escolha um jogo </option>

                    {games.map(game => (
                        <option key={game.id} selected={id_game === game.id} value={game.id}>{game.name}</option>
                    ))}

                </select>

                <Suspense fallback={<div></div>}>
                    <Input value={fps_average} name='fps_average' type='number' isRequired={true} placeholder='FPS' onKeyUp={onKeyUp}/>
                </Suspense>

                <button onClick={onDelete} type='button' className="delete-fps-average"> X </button>
            </div>

            { classOption && <p>Este jogo já foi selecionado</p>}

       </div> 
    )
}

export default FPSInput