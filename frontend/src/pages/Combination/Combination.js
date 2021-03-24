import React, { useEffect, useState, Suspense, lazy } from 'react'

import axios from 'axios'
import api from '../../services/api'

import { Plus } from 'react-feather'
import { debounceEvent, slugify } from '../../utils/index'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import { GameInterface, CombinationInterface, ComponentsInterface, FPSAverageInterface } from '../../utils/interfaces.json'

import './styles.css'

const Input = lazy(() => import('../../components/Input/Input'))
const FPSInput = lazy(() => import('../../components/FPSInput/FPSInput'))

const Combination = props => {
    const { id } = useParams(), history = useHistory()

    const [ games, setGames ] = useState([ { ...GameInterface } ])
    const [ combination, setCombination ] = useState({ ...CombinationInterface })
    const [ components, setComponents ] = useState({ ...ComponentsInterface })

    const [ FPSAverages, setFPSAverages ] = useState([ { ...FPSAverageInterface } ])

    const [ FPSInputs, setFPSInputs ] = useState([id || { key: 0, gameValue: 0, fpsValue: 0, isDuplicated: false }])

    const user = sessionStorage.getItem('user')

    useEffect(() => {
        (async() => {
            const source = axios.CancelToken.source()

            try{ 
                const { data: receivedGames } = await api.get('/games', { cancelToken: source.token })
                
                if(id){
                    const { data: receivedCombination } = await api.get(`/combinations/${id}`, { cancelToken: source.token })

                    const { fps_averages: receivedFPSAverages } = receivedCombination, receivedComponents = { ...ComponentsInterface }

                    Object.keys(receivedComponents).forEach(key => receivedComponents[key] = receivedCombination[key])

                    setComponents(receivedComponents)
                    setCombination(receivedCombination)
                    setFPSAverages(receivedFPSAverages) 
                }

                setGames(receivedGames)
            }
            catch(error){
                return error
            }

            return () => source.cancel("Requisição Cancelada")
        })()

    }, [ id ])

    const verifyDuplicatedFPSAverages = ({ id_game, index }) => {
        const status = FPSAverages.every(({ id_game: comparativeIDGame }, comparativeIndex) => {
            if(comparativeIndex !== index){
                if(comparativeIDGame === id_game && id_game !== 0)
                    return true
                else 
                    return false
            }

            return false
        })
        
        return status
    }

    
    const addFPSAverage = () => setFPSAverages([ ...FPSAverages, { id_game: 0, id_combination: id, fps_average: 0 } ])

    const removeFPSAverage = ({ target }) => {
        const { dataset: { id_game } } = target.parentNode

        if(Number(id_game)) 
            return
        else
            setFPSAverages(FPSAverages.filter(FPSAverage => FPSAverage.id_game !== Number(id_game)))
    }

    /*const addFPSInput = () => {
        const newKey = FPSInputs[FPSInputs.length - 1].key + 1

        setFPSInputs([...FPSInputs, { key: newKey, gameValue: 0, fpsValue: 0, isDuplicated: false }])
    }*/

    /*const removeFPSInput = ({ target }) => {
        const { dataset: { id } } = target.parentNode
        
        if(Number(id) === 0) return
        
        setFPSInputs(FPSInputs.filter(input => input.key !== Number(id)))
    }*/

   /* const handleGameSelection = ({ target }) => {
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
*/
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
            id || await api.post('/combinations', { ...newCombination }, { 
                headers: { 'Access-Control-Allow-Origin': '*', user }, 
                cancelToken: source.token,
            })

            id && await api.put('/combinations', { id, ...newCombination }, { 
                headers: { user }, 
                cancelToken: source.token 
            })
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
                            <Suspense key={index} fallback={<div></div>}>
                                <Input 
                                    value={input.value}
                                    label={input.label}
                                    id={slugify({ text: input.label })}
                                    name={input.name}
                                    isRequired={input.isRequired}
                                    onKeyUp={debounceEvent(input.onKeyUp)}
                                />
                            </Suspense>
                        ))}
                    
                    <div className="fps-input-container">
                        <h2>Jogos:</h2>

                        {
                            FPSAverages.map(({ id_game, fps_average }, index) => {
                                const classOption = verifyDuplicatedFPSAverages({ id_game, index }) ? 'duplicated' : ''

                                return (
                                    <Suspense key={id_game} fallback={<div></div>}>
                                        <FPSInput 
                                            games={games}
                                            id_game={id_game}
                                            classOption={classOption}
                                            fps_average={fps_average}
                                            onSelect={(event) => {console.log(event.target.value)}}
                                            onDelete={() => {}}
                                            onKeyUp={debounceEvent(() => {})}
                                        />
                                    </Suspense>
                                )
                            })
                        }

                        <button title="Adicionar mais uma média de FPS à combinação" onClick={addFPSAverage} type="button" className="add-new-fps-average">
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

/**
 * {FPSInputs.map(input => 
                            <Suspense key={input.key} fallback={<div></div>}>
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
                            </Suspense>
                        )}  
 */

export default Combination