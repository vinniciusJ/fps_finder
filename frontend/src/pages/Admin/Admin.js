import React from 'react'
import { Plus } from 'react-feather'

import Combination from '../../components/Combination/Combination'

import ValorantLogo from '../../assets/images/valorant.png'
import CSGOLogo from '../../assets/images/csgo.png'
import LOLLogo from '../../assets/images/lol.png'

import './styles.css'

const Admin = () => {
    const games = [
        {
            id: 1,
            name: 'Valorant',
            url_logo: ValorantLogo
        },
        {
            id: 2,
            name: 'Counter Strike: Global Offensive',
            url_logo: CSGOLogo
        },
        {
            id: 3,
            name: 'League Of Legends',
            url_logo: LOLLogo
        },
        {
            id: 4,
            name: 'Valorant',
            url_logo: ValorantLogo
        },
        {
            id: 5,
            name: 'Valorant',
            url_logo: ValorantLogo
        }
    ]
    const combination = {
        id: 4,
        name: 'Intel 2',
        graphic_card: 'Nvidia GeForce GTX 1660 Super',
        motherboard: 'ASRock H370M Pro4',
        processor: 'Intel Core i7-10700K',
        ram_memory: '16GB DDR4',
        FPSAverage: [
            {id: 16, fps_average: 140, id_combination: 4, id_game: 1},
            {id: 17, fps_average: 180, id_combination: 4, id_game: 5},
            {id: 18, fps_average: 180, id_combination: 4, id_game: 2},
            {id: 19, fps_average: 110, id_combination: 4, id_game: 3},
            {id: 20, fps_average: 180, id_combination: 4, id_game: 4}
        ]
    }

    return (
        <div className="Admin">
            <header className="admin-header">
                <div>
                    <p className="total-combinations">Total de Combinações: 6</p>
                    <input type="text" placeholder="Buscar por nome..." id="name" name="name"/>
                    <button className="add-new-combination">
                        <Plus color="#FFF" width={24} height={24} strokeWidth={1}/>
                    </button>
                    
                </div>
            </header>
            <main className="combinations">
                <Combination combination={combination} games={games}/>
            </main>
        </div>
    )
}

export default Admin