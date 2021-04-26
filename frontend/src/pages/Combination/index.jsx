import React, { useEffect, useState, Suspense, lazy } from 'react'

import axios from 'axios'

import { Plus } from 'react-feather'
import { calculatorAPI } from '../../services/api'
import { debounceEvent, slugify } from '../../utils/index'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import { CombinationInterface, GameInterface, FPSAverageInterface, InputsInterface } from '../../utils/interfaces.json'

import './styles.css'

const ComponentInput = lazy(() => import('../../components/ComponentInput/'))
const FPSInput = lazy(() => import('../../components/FPSInput/'))

const Combination = props => {
    const { id } = useParams(), history = useHistory()

    const [ games, setGames ] = useState([ { ...GameInterface } ])
    const [ components, setComponents ] = useState({ ...InputsInterface })
    const [ combination, setCombination ] = useState({ ...CombinationInterface })
    const [ FPSAverages, setFPSAverages ] = useState([ { ...FPSAverageInterface } ])

    const [ duplicatedValue, setDuplicatedValue ] = useState({ id: null, status: false })
    const [ inputs, setInputs ] = useState([{ value: '', link: '', key: '', label: '' }])

    const user = sessionStorage.getItem('user')

    useEffect(() => {
        (async() => {
            const source = axios.CancelToken.source()

            try{ 
                const { data: receivedGames } = await calculatorAPI.get('/games', { cancelToken: source.token })
                
                if(id){
                    const { data: receivedCombination } = await calculatorAPI.get(`/combinations/${id}`, { cancelToken: source.token })
                    const { fps_averages: receivedFPSAverages } = receivedCombination

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

    useEffect(() => {
        let data = { ...InputsInterface }, { fps_averages } = combination
    
        if(!fps_averages[0].id) fps_averages = [ { fake_id: 0,  fps_average: null, id_game: null} ]

        const labels = {
            graphic_card: 'Placa de Vídeo', 
            processor: 'Processador', 
            ram_memory: 'Memória RAM', 
            motherboard: 'Placa Mãe'
        }

        Object.keys(data).forEach(key => data[key] = combination[key])

        const inputs = Object.keys(labels).map(key => ({
            value: data[key] ?? '', 
            name: key,
            link: data[`${key}_link`] ?? '', 
            label: labels[key] 
        }))

        setInputs(inputs)
        setComponents(data)
        setFPSAverages(fps_averages)

    }, [ combination ])

    const verifyDuplicatedFPSAverages = ({ currentFPSAverages, FPSAverage }) => {
        const filteredeFPSAverages = currentFPSAverages.filter(({ id_game }) => FPSAverage.id_game === id_game)

        if(filteredeFPSAverages.length > 1){
            return setDuplicatedValue({ id: filteredeFPSAverages[1].id, status: true })
        }

        setDuplicatedValue({ id: null, status: false })
    }
    
    const addFPSAverage = () => {
        const { id: lastID, fake_id: lastFakeID } = FPSAverages[FPSAverages.length - 1]

        if(lastFakeID === 0){
            return setFPSAverages([ ...FPSAverages, { fake_id: (lastFakeID + 1) ,id_game: 0, id_combination: Number(id), fps_average: 0 }])
        }

        setFPSAverages([ ...FPSAverages, { fake_id: (lastID + 1) ,id_game: 0, id_combination: Number(id), fps_average: 0 }])
    }

    const removeFPSAverage = ({ target }) => {
        const { dataset: { id } } = target.parentNode

        setFPSAverages(FPSAverages.filter(FPSAverage => {
            const { id: currentID } = FPSAverage

            if(!currentID) 
                return FPSAverage.fake_id !== Number(id)
            else
                return FPSAverage.id !== Number(id)
        }))
    }

    const updateFPSAverage = ({ value, id, attr }) => {
        const newFPSAverages = FPSAverages.map((FPSAverage, index) => {

            if(FPSAverage.id === Number(id) || FPSAverage.fake_id === Number(id)){       
                if(attr === 'id_game'){
                    const { id_game, ...data } = FPSAverage
    
                    return { ...data, id_game: Number(value) }
                }
                else {
                    const { fps_average, ...data } = FPSAverage
    
                    return { ...data, fps_average: Number(value) }
                }
            }
            
            return { ...FPSAverage }
        })

        newFPSAverages.forEach((FPSAverage) => verifyDuplicatedFPSAverages({currentFPSAverages: newFPSAverages, FPSAverage}))

        return newFPSAverages
    }

    const handleGameSelection = ({ target }) => {
        const { value } = target, { dataset: { id }  } = target.parentNode

        setFPSAverages(updateFPSAverage({ value, id, attr: 'id_game' }))
    }

    const handleFPSAverageInput = ({ target }) => {
        const { value } = target, { dataset: { id } } = target.parentNode.parentNode

        setFPSAverages(updateFPSAverage({ value, id, attr: 'fps_average' }))
    }

    const handleComponentInput = ({ target }) => {
        const modifiedComponents = { ...components }

        modifiedComponents[target.name] = target.value
        
        setComponents(modifiedComponents)
    }
    
    const saveCombination = async event => {
        event.preventDefault()

        const isUndefined = value => value === undefined ? null : value

        const { 
            name, graphic_card, processor, ram_memory, motherboard,
            graphic_card_link, processor_link, ram_memory_link, motherboard_link
        } = components


        if(!(name && graphic_card && processor && ram_memory && motherboard)) 
            return alert('Por favor, você deve preencher todos os campos de componentes.')

        if(FPSAverages.map(({ fps_average }) => fps_average).includes(0))
            return alert('Por favor, em todos os campos de seleção você deve selecionar um jogo.')

        const finalComponents = { name, graphic_card, processor, ram_memory, motherboard }

        const components_links = { 
            graphic_card_link: isUndefined(graphic_card_link), 
            processor_link: isUndefined(processor_link), 
            ram_memory_link: isUndefined(ram_memory_link), 
            motherboard_link: isUndefined(motherboard_link) 
        }

        const finalFPSAverages = FPSAverages.map(FPSAverage => {
            const { id, fake_id, fps_average, id_combination, id_game } = FPSAverage

            return (fake_id === 0 || fake_id) ? { id_game, fps_average } : { id, id_combination, id_game, fps_average }
        })

        const newCombination = { ...finalComponents, components_links, fps_averages: finalFPSAverages }

        const source = axios.CancelToken.source()

        try{
            id || await calculatorAPI.post('/combinations', { ...newCombination }, { headers: { user }, cancelToken: source.token })

            id && await calculatorAPI.put('/combinations', { id, ...newCombination }, { headers: { user },  cancelToken: source.token })
        }
        catch{
            alert(`Houve um problema na ${id ? 'edição' : 'criação'} da combinação, por favor tente mais tarde novamente.`)
        }
         
        history.push('/calculator-admin')

        return () => source.cancel()
    }
   
    const cancelOperation = event => {
        event.preventDefault()

        history.push('/calculator-admin')
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
                        <Suspense key={`comp-input-${0.1}`} fallback={<div></div>}>
                            <ComponentInput
                                idComp={slugify({ text: 'Nome da Combinação' })}
                                idLink={slugify({ text: 'Nome da Combinação Link' })}
                                label={'Nome da combinação'}
                                name={'name'}
                                singleInput={true}
                                value={components.name}
                                onChange={handleComponentInput}
                            />
                        </Suspense>

                        {inputs.map(({ value, link, label, name }, index) => (
                            <Suspense key={`comp-input-${index}`} fallback={<div></div>}>
                                <ComponentInput
                                    idComp={slugify({ text: label ?? ' ' })}
                                    idLink={slugify({ text: `${label ?? ' '} link` })}
                                    label={label}
                                    name={name}
                                    value={value}
                                    link={link}
                                    onChange={handleComponentInput}
                                />
                            </Suspense>
                        ))}
                    
                    <div className="fps-input-container">
                        <h2>Jogos:</h2>

                        {
                            FPSAverages.map(({ id, fake_id, id_game, fps_average }, index) => {
                                const { id: idDuplicatedValue, status } = duplicatedValue
                                const classOption =  (idDuplicatedValue === id && status) ? 'duplicated': ''

                                return (
                                    <Suspense key={id_game} fallback={<div></div>}>
                                        <FPSInput 
                                            games={games}
                                            id={id ?? fake_id}
                                            selectedGame={id_game}
                                            classOption={classOption}
                                            fps_average={fps_average}
                                            onSelect={handleGameSelection}
                                            onDelete={removeFPSAverage}
                                            onKeyUp={debounceEvent(handleFPSAverageInput)}
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

export default Combination