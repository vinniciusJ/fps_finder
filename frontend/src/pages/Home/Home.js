import React, { useState } from 'react'

import PopUp from '../../components/PopUp/PopUp'
import SelectInput from '../../components/SelectInput/SelectInput'

import FPSFinderLogo from '../../assets/images/logo.svg'
import graphicCardImage from '../../assets/images/graphic-card.svg'


import './styles.css'

const Home = () => {
    const [ selectedGraphicCard, setSelectedGraphicCard ] = useState('')
    const [ selectedProcessor, setSelectedProcessor ] = useState('')
    const [ selectedRamMemory, setSelectedRamMemory ] = useState('')
    
    const handleProcessorChange = event => {
        const processor = event.target.value

        setSelectedProcessor(processor)
    }

    const handleRamMemoryChange = event => {
        const ramMemory = event.target.value

        setSelectedRamMemory(ramMemory)
    }

    const handleGraphicCardChange = event => {
        const graphicCard = event.target.value
        
        setSelectedGraphicCard(graphicCard)
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
                <div>
                    <SelectInput 
                        label="Placa de Vídeo"
                        selectedOption={selectedGraphicCard}
                        options={[]} 
                        handleSelectChange={handleGraphicCardChange}
                    />

                    <PopUp>
                        <section className="popup-title">
                            <img src={graphicCardImage} alt="Placa Gráfica"/>
                            <h2>Placa Gráfica</h2>
                        </section>
                        <main>
                            <p>
                            A placa de vídeo é um dos principais componentes de qualquer pc, principalmente se seu foco é rodar jogos. A placa de vídeo é a peça responsável por gerar as imagens que você vê na tela.</p> 
                        </main>
                    </PopUp>
                </div>
                <div>
                    <SelectInput 
                        label="Processador" 
                        selectedOption={selectedProcessor} 
                        options={[]} 
                        handleSelectChange={handleProcessorChange}
                    />
                </div>
                <div>
                    <SelectInput 
                        label="Memória RAM" 
                        selectedOption={selectedRamMemory} 
                        options={[]} 
                        handleSelectChange={handleRamMemoryChange}
                    />
                </div>

                <section className="operations-buttons">
                    <button className="btn main">Calcular</button>
                    <button className="btn">Limpar campos</button>
                </section>
            </main>

            <div className="section-title">
                <h1>RESULTADO</h1>
            </div>

            
        </div>
    )
}

export default Home

//