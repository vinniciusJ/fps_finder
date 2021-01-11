import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { Plus } from 'react-feather'

import Input from '../../components/Input/Input'
import FPSInput from '../../components/FPSInput/FPSInput'

import api from '../../services/api'
import { debounceEvent } from '../../utils/index'

import './styles.css'

const Combination = () => {
    const { id } = useParams()
    
    const [ games, setGames ] = useState([])
    const [ combination, setCombination ] = useState({})

    const [ FPSInputs, setFPSInputs ] = useState([!id && { key: 0, gameValue: 0, fpsValue: 0, isDuplicated: false }])
    const [ components, setComponents ] = useState({ graphic_card: '', processor: '', ram_memory: '', motherboard: '' })

    const [ backToAdminPainel, setBackToAdminPainel ] = useState(false)

    useEffect(() => api.get('/games').then(response => setGames(response.data)), [ ])
    useEffect(() => {
        id && api.get('/combinations', { params: { id } }).then(response => {
            const [ selectedCombination ] = response.data
            const { FPSAverages, name, graphic_card, processor, ram_memory, motherboard } = selectedCombination

            const FPSInputValues = FPSAverages.map((average, index) => {
                return {
                    key: index,
                    gameValue: average.id_game,
                    fpsValue: average.fps_average,
                    isDuplicated: false
                }
            })

            setCombination(selectedCombination)
            setComponents({ name, graphic_card, processor, ram_memory, motherboard })
            setFPSInputs(FPSInputValues)
        })
    }, [ id ])
    
    const addFPSInput = () => {
        const newKey = FPSInputs[FPSInputs.length - 1].key + 1

        setFPSInputs([...FPSInputs, { key: newKey, gameValue: 0, fpsValue: 0, isDuplicated: false }])
    }

    const removeFPSInput = ({ target }) => {
        const { dataset: { id } } = target.parentNode
        
        if(Number(id) === 0) return
        
        setFPSInputs(FPSInputs.filter(input => input.key !== Number(id)))
    }

    const handleGameSelection = ({ target }) => {
        const { value: gameID } = target
        const { dataset: { id: inputID } } = target.parentNode
    
        const selectedGames = FPSInputs.map(input => input.gameValue)

        if(selectedGames.includes(Number(gameID))){ 
            const duplicatedFieldInputs = FPSInputs.map(input => {
                if(input.key === Number(inputID)){
                    return { 
                        key: input.key, 
                        gameValue: Number(gameID), 
                        fpsValue: input.fpsValue, 
                        isDuplicated: Number(gameID) === 0 ? false : true
                    }
                }

                return input
            })

            setFPSInputs(duplicatedFieldInputs)

            return
        }

        const modifiedFPSInputs = FPSInputs.map((input, index) => {
            if(index === Number(inputID)){
                const { key, gameValue, fpsValue, isDuplicated } = input
            
                const newInput = { key, gameValue, fpsValue, isDuplicated }
                
                if(gameValue !== Number(gameID)) newInput.gameValue = Number(gameID)
                if(input.isDuplicated) newInput.isDuplicated = false
    
                return newInput 
            }
 
            return input
        })
 
        setFPSInputs(modifiedFPSInputs)
    }

    const handleFPSInput = ({ target }) => {
        const { value } = target
        const { dataset: { id: inputID } } = target.parentNode.parentNode

        const modifiedFPSInputs = FPSInputs.map(input => {
            if(input.key === Number(inputID)){
                let { key, gameValue, fpsValue, isDuplicated } = input

                fpsValue = Number(value)

                return { key, gameValue, fpsValue, isDuplicated}
            }

            return input
        })

        setFPSInputs(modifiedFPSInputs)
    }

    const handleComponentInput = ({ target }) => {
        const copiedComponents = components

        copiedComponents[target.name] = target.value

        setComponents(copiedComponents)
    }

    const componentsInput = [
        { value: combination.name ?? '', label: 'Nome da Combinação', name: 'name', isRequired: true, onKeyUp: handleComponentInput },
        { value: combination.graphic_card ?? '', label: 'Placa de Vídeo' ,name: 'graphic_card', isRequired: true, onKeyUp: handleComponentInput },
        { value: combination.processor ?? '', label: 'Processador', name: 'processor', isRequired: true, onKeyUp: handleComponentInput },
        { value: combination.ram_memory ?? '', label: 'Memória RAM', name: 'ram_memory', isRequired: true, onKeyUp: handleComponentInput },
        { value: combination.motherboard ?? '', label: 'Placa Mãe', name: 'motherboard', isRequired: true, onKeyUp: handleComponentInput }
    ]

    const saveCombination = event => {
        event.preventDefault()

        const { name, graphic_card, processor, ram_memory, motherboard } = components
        const gamesValues = FPSInputs.map(input => input.gameValue) 

        if(!(name && graphic_card && processor && ram_memory && motherboard)) 
            return alert('Por favor, você deve preencher todos os campos de componentes.')

        if(gamesValues.includes(0)) return alert('Por favor, em todos os campos de seleção você deve selecionar um jogo.')

        const fps_averages = FPSInputs.map(input => {
            const { gameValue, fpsValue } = input

            return { fps_average: fpsValue, id_game: gameValue }
        })

        const newCombination = { ...components, fps_averages }

        console.log(newCombination)
    }

    const cancelOperation = event => {
        event.preventDefault()

        setBackToAdminPainel(true)
    }

    return (
        <div className="Combination">
            <header className="combination-header">
                <h2>{id ? 'Editar combinação: ' : 'Criar uma combinação: '}</h2>
            </header>
            <main className="combination-data-container">
                <form className='combination-form'>
                    {componentsInput.map((input, index) => (
                        <Input 
                            key={index}
                            value={input.value}
                            label={input.label}
                            name={input.name}
                            isRequired={input.isRequired}
                            onKeyUp={debounceEvent(input.onKeyUp)}
                        />
                    ))}
                    
                    <div className="fps-input-container">
                        <h2>Jogos:</h2>

                        {FPSInputs.map(input => 
                            <FPSInput 
                                key={input.key} 
                                id={input.key}
                                selectValue={input.gameValue}
                                inputValue={input.fpsValue}
                                isDuplicated={input.isDuplicated}
                                options={games} 
                                handleSelect={handleGameSelection} 
                                handleInput={debounceEvent(handleFPSInput)} 
                                deleteInput={removeFPSInput}
                            />
                        )}                        

                        <button onClick={addFPSInput} type="button" className="add-new-fps-average">
                            <Plus color='#FFF' height={48} width={48} strokeWidth={1}/>
                        </button>
                    </div>
                    <footer className="edit-add-buttons">
                        <button className="btn main" onClick={saveCombination}>Salvar</button>
                        <button className="btn" onClick={cancelOperation}>Cancelar</button>
                    </footer>
                </form>
            </main>
            {backToAdminPainel &&  <Redirect to='/admin' /> }
        </div>
    )
}

export default Combination