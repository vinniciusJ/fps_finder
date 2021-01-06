import React from 'react'
import { MoreHorizontal, Edit3, X } from 'react-feather'

import GameContainer from '../../components/GameContainer/GameContainer'

import './styles.css'

const Combination = props => {
    const { combination, games } = props
   
    const componentsText = { 
        graphic_card: 'Placa de Vídeo',
        processor: 'Processador',
        ram_memory: 'Memória RAM',
        motherboard: 'Placa Mãe'
    }
    
    return (
        <>
        <section className="combination-container">
            <header>
                <h2>{combination.name}:</h2>
                <button className="more-options">
                    <MoreHorizontal width={32} height={32} fill='none' strokeWidth={1}/>
                </button>

                <div className="combination-options">
                    <button className='edit-combination'><Edit3 width={16}/>Editar</button>
                    <button className='delete-combination'><X width={16}/>Apagar</button>
                </div>
            </header>
            <main className="combinations-data">
                <section className="combinations-components">
                    <ul>
                        {Object.keys(componentsText).map(key => {
                            return <li key={key}><span className="component">{componentsText[key]} &nbsp;</span>{combination[key]}</li>
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

export default Combination