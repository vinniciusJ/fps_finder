import React, { useState } from 'react'
import { MoreHorizontal, Edit3, X } from 'react-feather'
import { Link } from 'react-router-dom'

import GameContainer from '../GameContainer/GameContainer'

import './styles.css'

const CombinationBox = props => {
    const { combination, games } = props
    const [ isMoreOptionVisible, setIsMoreOptionVisible ] = useState(false)
   
    const componentsText = { 
        graphic_card: 'Placa de Vídeo',
        processor: 'Processador',
        ram_memory: 'Memória RAM',
        motherboard: 'Placa Mãe'
    }
    
    const handleMoreOptions = () => setIsMoreOptionVisible(!isMoreOptionVisible)
    

    return (
        <>
        <section className="combination-container">
            <header>
                <h2>{combination.name}:</h2>
                <button className="more-options" onClick={handleMoreOptions}>
                    <MoreHorizontal width={32} height={32} fill='none' strokeWidth={1}/>
                </button>

                {isMoreOptionVisible && 
                    <div className="combination-options">
                        <Link to={`/combination/${combination.id}`} className='edit-combination'><Edit3 width={16}/>Editar</Link>
                        <button className='delete-combination' data-id={combination.id}><X width={16}/>Apagar</button>
                     </div>
                }
            </header>
            <main className="combinations-data">
                <section className="combinations-components">
                    <ul>
                        {Object.keys(componentsText).map(key => {
                            return <li key={key}><span className="component">{componentsText[key]}: </span>{combination[key]}</li>
                        })}  
                    </ul>
                </section>
                <aside className="combinations-game">
                    {combination.FPSAverages.map(FPSAverage => {
                        const [ currentGame ] = games.filter(game => game.id === FPSAverage.id_game)

                        return <GameContainer name={currentGame.name} FPSAverage={FPSAverage.fps_average} URLLogo={currentGame.url_logo} background='#FFF' key={currentGame.name}/>
                    })}
                </aside>
            </main>
        </section>
        </>
    )
}

export default CombinationBox