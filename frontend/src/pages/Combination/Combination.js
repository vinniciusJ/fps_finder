import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import { Plus } from 'react-feather'

import Input from '../../components/Input/Input'
import FPSInput from '../../components/FPSInput/FPSInput'

import api from '../../services/api'
import { debounceEvent } from '../../utils/index'

import './styles.css'

const Combination = props => {
    const { id } = useParams()
    const history = useHistory()

    const [ games, setGames ] = useState([])
    const [ combination, setCombination ] = useState({})

    const [ FPSInputs, setFPSInputs ] = useState([id || { key: 0, gameValue: 0, fpsValue: 0, isDuplicated: false }])
    const [ components, setComponents ] = useState({ graphic_card: '', processor: '', ram_memory: '', motherboard: '' })

    const user = sessionStorage.getItem('user')

    useEffect(() => 
        (async() => {
            const source = axios.CancelToken.source()

            try{ 
                const { data } = await api.get('/games', { 
                    headers: { user },
                    cancelToken: source.token
                })

                setGames(data)
            }
            catch(error){
                return error
            }

            return () => source.cancel("Requisição Cancelada")
        })(), 
        [ user ]
    )
    
    useEffect(() => {
        const source = axios.CancelToken.source()
    
        id && (async () => {      
            try{
                const { data: [ selectedCombination ] } =  await api.get(`/combinations/${id}`, { 
                    headers: { user }, 
                    cancelToken: source.token 
                })

                const { FPSAverages, name, graphic_card, processor, ram_memory, motherboard } = selectedCombination

                const FPSInputValues = FPSAverages.map((average, index) => ({
                    key: index,
                    id: average.id,
                    gameValue: average.id_game,
                    fpsValue: average.fps_average,
                    isDuplicated: false
                }))

                setCombination(selectedCombination)
                setComponents({ name, graphic_card, processor, ram_memory, motherboard })
                setFPSInputs(FPSInputValues)
            }
            catch(error){
                alert('Houve um problema para buscar os dados, por favor espere um pouco e tente novamente.')

                history.goBack()
            }
        })()

        return () => source.cancel("Requisição Cancelada")

    }, [ id, user, history ])

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
                        id: input.id,
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
                const { key, id: FPSId, gameValue, fpsValue, isDuplicated } = input
            
                const newInput = { key, id: FPSId, gameValue, fpsValue, isDuplicated }
                
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
                let { key, id, gameValue, fpsValue, isDuplicated } = input

                fpsValue = Number(value)
        
                return id ? { key, id, gameValue, fpsValue, isDuplicated} : { key, gameValue, fpsValue, isDuplicated}
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

    const saveCombination = async event => {
        event.preventDefault()

        const { name, graphic_card, processor, ram_memory, motherboard } = components
        const gamesValues = FPSInputs.map(input => input.gameValue) 

        if(!(name && graphic_card && processor && ram_memory && motherboard)) 
            return alert('Por favor, você deve preencher todos os campos de componentes.')

        if(gamesValues.includes(0)) return alert('Por favor, em todos os campos de seleção você deve selecionar um jogo.')

        const fps_averages = FPSInputs.map(input => {
            const { id, gameValue, fpsValue } = input

            return id ? { id, fps_average: fpsValue, id_game: gameValue } : { fps_average: fpsValue, id_game: gameValue } 
        })

        const newCombination = { ...components, fps_averages }
        
        const source = axios.CancelToken.source()

        try{
            id || await api.post('/combinations', { ...newCombination }, { headers: { user }, cancelToken: source.token })
            id && await api.put('/combinations', { id, ...newCombination }, { headers: { user }, cancelToken: source.token })
        }
        catch{
            alert(`Houve um problema na ${id ? 'edição' : 'criação'} da combinação, por favor tente mais tarde novamente.`)
        }
         
        history.push('/admin')

        return () => source.cancel()
    }

    const cancelOperation = event => {
        event.preventDefault()

        history.push('/admin')
    }

    return (
        <div className="Combination">
            {user ? (
                <>
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
            
            </>
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
            )}
        </div>
    )
}

export default Combination