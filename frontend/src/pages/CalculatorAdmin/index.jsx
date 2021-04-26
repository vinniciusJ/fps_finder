import React, { useState, useEffect, Suspense, lazy } from 'react'

import axios from 'axios'

import { Redirect } from 'react-router-dom'
import { calculatorAPI } from '../../services/api'
import { AlertCircle } from 'react-feather'
import { createSearcher } from '../../utils'
import { CombinationInterface, GameInterface} from '../../utils/interfaces.json'

import './styles.css'

const AdminMenu = lazy(() => import('../../components/AdminMenu/'))
const CombinationBox = lazy(() => import('../../components/CombinationBox/'))

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
                const { data: receivedCombinations } = await calculatorAPI.get('/combinations', { cancelToken: source.token })
                const { data: receivedGames } = await calculatorAPI.get('/games', { cancelToken: source.token })

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
        const searcher = createSearcher({ value })
        
        const foundCombinations = combinations.filter(({ name }) => name.toUpperCase().match(searcher))
        const newListedCombinations = foundCombinations.length ? foundCombinations : [ { ...CombinationInterface } ]

        setListedCombinations(newListedCombinations)
    }

    const isThereAnyCombination = () => listedCombinations[0].id ? true : false

    return (
        <div className="Admin">
            {user ? (
                <>
                <Suspense fallback={<div></div>}>
                    <AdminMenu 
                        onSearch={handleKeyUp} 
                        total={totalCombinations}
                        type="combination"
                    />
                </Suspense>
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
                                <p> Nenhuma combinação foi encontrada</p>
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