import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus } from 'react-feather'

import Input from '../../components/Input/Input'
import FPSInput from '../../components/FPSInput/FPSInput'

import api from '../../services/api'
import { debounceEvent } from '../../utils/index'

import './styles.css'

const Combination = () => {
    const { id } = useParams()
    
    const [ games, setGames ] = useState([])
    const [ FPSInputs, setFPSInputs ] = useState([{ key: 0, selectValue: 0, inputValue: '', isDuplicated: false }])
    const [ combination, setCombination ] = useState({})

    const textInputs = [
        { value: combination.name ?? '', label: 'Nome da Combinação', name: 'name', isRequired: true, onKeyUp: () => {} },
        { value: combination.graphic_card ?? '', label: 'Placa de Vídeo', name: 'graphic_card', isRequired: true, onKeyUp: () => {} },
        { value: combination.processor ?? '', label: 'Processador', name: 'processor', isRequired: true, onKeyUp: () => {} },
        { value: combination.ram_memory ?? '', label: 'Memória RAM', name: 'ram_memory', isRequired: true, onKeyUp: () => {} },
        { value: combination.motherboard ?? '', label: 'Placa Mãe', name: 'motherboard', isRequired: true, onKeyUp: () => {} }
    ]


    useEffect(() => api.get('/games').then(response => setGames(response.data)), [ ])
    useEffect(() => id && api.get('/combinations', { params: { id } }).then(response => setCombination(...response.data)))
    
    useEffect(() => console.log(FPSInputs), [ FPSInputs ])

    const handleGameSelection = ({ target }) => {
        const { dataset: { id: inputID }, value: gameID } = target
    
        const selectedGames = FPSInputs.map(input => input.selectValue)

        if(selectedGames.includes(Number(gameID))){ 
            const duplicatedFieldInputs = FPSInputs.map(input => {
                if(input.key === Number(inputID)){
                    return { 
                        key: input.key, 
                        selectValue: Number(gameID), 
                        inputValue: input.inputValue, 
                        isDuplicated: Number(gameID) === 0 ? false : true
                    }
                }

                return input
            })

            setFPSInputs(duplicatedFieldInputs)

            return
        }

        const newFPSInputs = FPSInputs.map((input, index) => {
            if(index === Number(inputID)){
                const { key, selectValue, inputValue, isDuplicated } = input
            
                const newInput = { key, selectValue, inputValue, isDuplicated }
                
                if(selectValue !== Number(gameID)) newInput.selectValue = Number(gameID)
                if(input.isDuplicated) newInput.isDuplicated = false
    
                return newInput 
            }
 
            return input
        })
 
        setFPSInputs(newFPSInputs)
    }

    const handleFPSInput = ({ target: { value } }) => {

    }

   
    const addFPSInput = () => {
        const newKey = FPSInputs[FPSInputs.length - 1].key + 1

        setFPSInputs([...FPSInputs, { key: newKey, value: 0, isDuplicated: false }])
    }

    const removeFPSInput = ({ target: { dataset: { id } } }) => {
        if(Number(id) === 0) return
        
        setFPSInputs(FPSInputs.filter(input => input.key !== Number(id)))
    }

    return (
        <div className="Combination">
            <header className="combination-header">
                <h2>{id ? 'Editar combinação: ' : 'Criar uma combinação: '}</h2>
            </header>
            <main className="combination-data-container">
                <form className='combination-form'>
                    {textInputs.map((input, index) => (
                        <Input 
                            key={index}
                            value={input.value}
                            label={input.label}
                            name={input.name}
                            isRequired={input.isRequired}
                            onKeyUp={input.onKeyUp}
                        />
                    ))}
                    
                    <div className="fps-input-container">
                        <h2>Jogos:</h2>

                        {FPSInputs.map(input => 
                            <FPSInput 
                                key={input.key} 
                                id={input.key}
                                isDuplicated={input.isDuplicated}
                                options={games} 
                                handleSelect={handleGameSelection} 
                                handleInput={(event) => console.log(event.target.value)} 
                                deleteInput={removeFPSInput}
                            />
                        )}                        

                        <button onClick={addFPSInput} type="button" className="add-new-fps-average">
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