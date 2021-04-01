import React, { useState, useEffect, Suspense, lazy } from 'react'

import axios from 'axios'
import api from '../../services/api'

import { Plus, AlertCircle, ArrowLeft } from 'react-feather'
import { Link, Redirect } from 'react-router-dom'
import { debounceEvent } from '../../utils/index'
import { CombinationInterface, GameInterface} from '../../utils/interfaces.json'

import './styles.css'

const CombinationBox = lazy(() => import('../../components/CombinationBox/CombinationBox'))

const CalculatorAdmin = props => {
    const [ games, setGames ] = useState([ { ...GameInterface } ])
    const [ combinations, setCombinations ] = useState([ { ...CombinationInterface } ])
    const [ listedCombinations, setListedCombinations ] = useState([ { ...CombinationInterface } ])

    const [ totalCombinations, setTotalCombinations ] = useState(0)
  
    const user = sessionStorage.getItem('user')
       
    useEffect(() => {
        (async () => {
            const source = axios.CancelToken.source()

            try{
                const { data: receivedCombinations } = await api.get('/combinations', { cancelToken: source.token })
                const { data: receivedGames } = await api.get('/games', { cancelToken: source.token })

                setGames(receivedGames)
                setCombinations(receivedCombinations)
                setListedCombinations(receivedCombinations)
                setTotalCombinations(receivedCombinations.length)
            }
            catch(error){
                alert(error.message)
            }

            return () => source.cancel("Requisição Cancelada")
        })()
    }, [ ])


    const handleKeyUp = ({ target: { value } }) => {
        const searcher = RegExp(`^.*(${value}).*$`)

        const foundCombinations = combinations.filter(({ name }) => name.match(searcher))
        const newListedCombinations = foundCombinations.length ? foundCombinations : [ { ...CombinationInterface } ]

        setListedCombinations(newListedCombinations)
    }

    const isThereAnyCombination = () => listedCombinations[0].id ? true : false

    return (
        <div className="Admin">
            {user ? (
                <>
                <header className="admin-header">
                    <div>
                        <Link className="link-go-back" to="/admin">
                            <ArrowLeft color="#FFF" width={24} height={24} strokeWidth={1.5}/>
                        </Link>
                        <p className="total-combinations">Total de Combinações: {totalCombinations}</p>
                        <label htmlFor="name">
                            <input 
                                type="text" 
                                placeholder="Buscar por nome..." 
                                id="name" 
                                name="name" 
                                onKeyUp={debounceEvent(handleKeyUp)} 
                                spellCheck={false
                            }/>
                        </label>
                        <Link className="add-new-combination" to="/combination">
                            <Plus color="#FFF" width={24} height={24} strokeWidth={1.5}/>
                        </Link>  
                    </div>
                </header>
                <main className="combinations">
                    <header className="combinations-registered">
                        <h2>Combinações Cadastradas</h2>
                    </header>
                    
                    {
                        isThereAnyCombination() ? (
                            <>
                                {listedCombinations.map(combination => 
                                    <Suspense key={combination.id}  fallback={<div></div>}>
                                        <CombinationBox 
                                            combination={combination} 
                                            games={games} 
                                        />
                                    </Suspense>
                                )}
                            </>
                        ) : (
                            <div className="no-combination-found">
                                <AlertCircle width={96} height={96} color='#E7E6E6'/>
                                <p>   
                                    Nenhuma combinação foi encontrada
                                </p>
                            </div>
                        )
                    }
                </main>
                
                </>
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
            )}
        </div>
    )
}

export default CalculatorAdmin