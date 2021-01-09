import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus } from 'react-feather'

import Input from '../../components/Input/Input'
import FPSInput from '../../components/FPSInput/FPSInput'

import api from '../../services/api'

import './styles.css'

const Combination = (props) => {
    const { id } = useParams()
    const [ games, setGames ] = useState([])
    const [ selectedGames, setSelectedGames ] = useState([0])
    const [ FPSInputs, setFPSInputs ] = useState([])

    useEffect(() => api.get('/games').then(response => setGames(response.data)), [   ])

    const handleSelectGames = event => {
        const { value: gameID } = event.target

        const [ selectedGame ] = games.filter(game => game.id === gameID)
      
        setSelectedGames([...selectedGames, selectedGame])
    }

    const deleteFPSInput = ({ target }) => setFPSInputs(FPSInputs.splice(FPSInputs.indexOf(target), 1))
    
    const addFPsInput = () => {
        setFPSInputs([...FPSInputs, (
            <FPSInput key={FPSInputs.length - 1} options={games} handleSelect={handleSelectGames} handleInput={(event) => console.log(event.target.value)} deleteInput={deleteFPSInput}/>
        )])
    }

    return (
        <div className="Combination">
            <header className="combination-header">
                <h2>{id ? 'Editar combinação: ' : 'Criar uma combinação: '}</h2>
            </header>
            <main className="combination-data-container">
                <form className='combination-form'>
                    <Input 
                        label='Nome da combinação' 
                        name='name'
                        isRequired={true}
                        onKeyUp={() => {}}
                    />
                    <Input 
                        label='Placa de Vídeo' 
                        name='graphic_card'
                        isRequired={true}
                        onKeyUp={() => {}}
                    />
                    <Input 
                        label='Processador' 
                        name='processor'
                        isRequired={true}
                        onKeyUp={() => {}}
                    />
                    <Input 
                        label='Memória RAM' 
                        name='ram_memory'
                        isRequired={true}
                        onKeyUp={() => {}}
                    />
                    <Input 
                        label='Placa Mãe' 
                        name='motherboard'
                        isRequired={true}
                        onKeyUp={() => {}}
                    />
                    <div className="fps-input-container">
                        <h2>Jogos:</h2>

                        <FPSInput options={games} handleSelect={handleSelectGames} handleInput={(event) => console.log(event.target.value)}/>
                        
                        {FPSInputs.map(container => container)}

                        <button onClick={addFPsInput} type="button" className="add-new-fps-average">
                            <Plus color='#FFF' height={48} width={48} strokeWidth={1}/>
                        </button>
                    </div>
                </form>
            </main>
            <footer className="edit-add-buttons">
                <button className="btn main">Salvar</button>
                <button className="btn">Cancelar</button>
            </footer>
        </div>
    )
}

export default Combination