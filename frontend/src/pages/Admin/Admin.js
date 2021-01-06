import React, { useState, useEffect } from 'react'
import { Plus } from 'react-feather'

import Combination from '../../components/Combination/Combination'

import api from '../../services/api'

import './styles.css'

const Admin = () => {
    const [ games, setGames ] = useState([])
    const [ combinations, setCombinations ] = useState([])
    const [ totalCombinations, setTotalCombinations ] = useState(0)

    useEffect(() => {
        api.get('/combinations').then(response => {
            setCombinations(response.data)
            setTotalCombinations(response.data.length)
        })
        api.get('/games').then(response => setGames(response.data))
    }, [ ])

    return (
        <div className="Admin">
            <header className="admin-header">
                <div>
                    <p className="total-combinations">Total de Combinações: {totalCombinations}</p>
                    <input type="text" placeholder="Buscar por nome..." id="name" name="name"/>
                    <button className="add-new-combination">
                        <Plus color="#FFF" width={24} height={24} strokeWidth={1}/>
                    </button>
                    
                </div>
            </header>
            <main className="combinations">
                <header className="combinations-registered">
                    <h2>Combinações Cadastradas</h2>
                </header>
                {combinations.map(combination => <Combination combination={combination} games={games} key={combination.id}/>)}
            </main>
        </div>
    )
}

export default Admin