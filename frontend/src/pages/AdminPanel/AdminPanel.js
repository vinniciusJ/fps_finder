import React, { useState, useEffect } from 'react'
import { Plus, AlertCircle } from 'react-feather'
import { Link, Redirect } from 'react-router-dom'

import CombinationBox from '../../components/CombinationBox/CombinationBox'

import api from '../../services/api'
import { debounceEvent } from '../../utils/index'

import './styles.css'

const AdminPanel = props => {
    const isThereUserLogged = sessionStorage.getItem('user')

    const [ games, setGames ] = useState([])
    const [ combinations, setCombinations ] = useState([])
    const [ totalCombinations, setTotalCombinations ] = useState(0)
    const [ isThereAnyCombination, setIsThereAnyCombination ] = useState(true)

    const handleKeyUp = ({ target: { value } }) => 
        api.get('/combinations', { params: { name: value } }).then(response => setCombinations(response.data))

    useEffect(() => {
        api.get('/combinations').then(response => {
            setCombinations(response.data)
            setTotalCombinations(response.data.length)
        }).catch(() => setIsThereAnyCombination(false))

        api.get('/games').then(response => setGames(response.data))
    }, [ ])

    useEffect(() => setIsThereAnyCombination(combinations.length !== 0), [ combinations ])

    return (
        <div className="Admin">
            {isThereUserLogged ? (
                <>
                <header className="admin-header">
                    <div>
                        <p className="total-combinations">Total de Combinações: {totalCombinations}</p>
                        <input type="text" placeholder="Buscar por nome..." id="name" name="name" onKeyUp={debounceEvent(handleKeyUp)} spellCheck={false}/>
                        <Link className="add-new-combination" to="/combination">
                            <Plus color="#FFF" width={24} height={24} strokeWidth={1}/>
                        </Link>  
                    </div>
                </header>
                <main className="combinations">
                    <header className="combinations-registered">
                        <h2>Combinações Cadastradas</h2>
                    </header>
                    {
                        isThereAnyCombination ? (
                            <>
                                {combinations.map(combination => <CombinationBox combination={combination} games={games} key={combination.id}/>)}
                            </>
                        ) : (
                            <div className="no-combination-found">
                                <AlertCircle width={96} height={96} color='#E7E6E6'/>
                                <p>   
                                    Nenhuma combinação com esse nome foi encontrada
                                </p>
                            </div>
                        )
                    }
                </main>
                </>
            ) : (
                <Redirect to={{ pathname: '/login/', state: { from: props.location }}} />
            )}
        </div>
    )
}

export default AdminPanel