import React, { useEffect, useState } from 'react'
import api from '../../services/api'

import SelectInput from '../../components/SelectInput/SelectInput'

import FPSFinderLogo from '../../assets/images/logo.svg'

import './styles.css'

const Home = () => {
    const options = ['Oi', 'Aoba', 'Suague', 'Eh nois']

    const [ graphicCards, setGraphicCards ] = useState([])
    const [ processors, setProcessors ] = useState([])
    const [ ramMemories, setRamMemories ] = useState([])

    useEffect(() => {
        const componentsParams = []

        api.get('combinations', { params: { components: componentsParams } }).then(response => {
            const { filteredCombinations } = response.data
            const components = [...filteredCombinations]

            const repeatedGraphicCards = []

            components.forEach(component => {
                repeatedGraphicCards.push(component.graphic_card)
            })
            
            setGraphicCards([...new Set(repeatedGraphicCards)])
        })
    }, [ ])


    const [ selectedGraphicCard, setselectedGraphicCard ] = useState('')

    
    const handleGraphicCardChange = event => {
        const graphicCard = event.target.value
        
        setselectedGraphicCard(graphicCard)
    }

    return (
        <div className="Home">
            <header className="main-header">
                <nav className="nav-bar">
                    <img src={FPSFinderLogo} alt="FPS Finder"/>
                </nav>
                <section className="presentation">
                    <h2>Calcule agora a média de FPS em jogos que sua máquina é capaz de alcançar! </h2>
                    <p>Através de pesquisas e testes a nossa calculadora é capaz de juntar as informações básicas de sua máquina, dadas por você, e calcular a média de FPS em que ela alcança em jogos selecionados.</p>
                </section>
            </header>

            <div className="section-title">
                <h1>CALCULAR</h1>
            </div>

            <main className="input-section">
                <SelectInput label="Placa de Vídeo" selectedOption={selectedGraphicCard} options={graphicCards} handleSelectChange={handleGraphicCardChange}/>
            </main>
        </div>
    )
}

export default Home

//