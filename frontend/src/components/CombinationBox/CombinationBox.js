import React, { useState, Suspense, lazy } from 'react'

import { Link } from 'react-router-dom'
import { MoreHorizontal, Edit3, X } from 'react-feather'
import { HashLink as InternalLink } from 'react-router-hash-link'

import './styles.css'

const GameContainer = lazy(() => import('../GameContainer/GameContainer'))
const DeletePopUp = lazy(() => import('../DeletePopUp/DeletePopUp'))

const CombinationBox = props => {
    const { combination, games } = props

    const [ isMoreOptionVisible, setIsMoreOptionVisible ] = useState(false)
    const [ isDeletePopupVisible, setIsDeletePopupVisible ] = useState(false)
   
    const componentsText = { 
        graphic_card: 'Placa de Vídeo',
        processor: 'Processador',
        ram_memory: 'Memória RAM',
        motherboard: 'Placa Mãe'
    }

    const handleMoreOptions = () => setIsMoreOptionVisible(!isMoreOptionVisible)
    
    const handleDeletePopupVisibility = () => {
        setIsDeletePopupVisible(!isDeletePopupVisible)
        setIsMoreOptionVisible(false)

        const maxWidthQuery = window.matchMedia('max-width: 416px')

        const changeOverflowY = element => {
            const { overflowY } = element.style

            element.style.overflowY = overflowY === 'hidden' ? 'initial' : 'hidden'
        }

        maxWidthQuery && changeOverflowY(document.documentElement)
        maxWidthQuery || changeOverflowY(document.body)
       
        return <InternalLink smooth to='#delete' />
    }

    return (
        <>
        <section className="combination-container">
            <header className="combination-container-header">
                <h2>{combination.name}:</h2>
                <button className="more-options" onClick={handleMoreOptions}>
                    <MoreHorizontal width={32} height={32} fill='none' strokeWidth={1}/>
                </button>

                {isMoreOptionVisible && 
                    <div className="combination-options">
                        <Link to={`/combination/${combination.id}`} className='edit-combination'><Edit3 width={16}/>Editar</Link>
                        <button 
                            className='delete-combination' 
                            data-id={combination.id} 
                            onClick={handleDeletePopupVisibility}
                        >
                            <X width={16}/>Apagar
                        </button>
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
                    {combination.fps_averages.map((fps_average, index) => {
                        const [ currentGame ] = games.filter(game => game.id === fps_average.id_game)
                
                        if(currentGame){
                            return (
                                <Suspense key={`${currentGame.name}#${Math.random() * (100 - 1) + 1}`} fallback={<div></div>}>
                                    <GameContainer name={currentGame.name} FPSAverage={fps_average.fps_average} logo={currentGame.url_logo} background='#FFF' />
                                </Suspense>
                            )
                        }

                        return <></>
                    })}
                </aside>
            </main>
            {isDeletePopupVisible && 
                <Suspense fallback={<div></div>}>
                    <DeletePopUp id={combination.id} name={combination.name} handlePopupVisibility={handleDeletePopupVisibility}/>
                </Suspense>
            }
        </section>
        </>
    )
}

export default CombinationBox