import React, { useState } from 'react'

import PopUp from '../../components/PopUp/PopUp'
import SelectInput from '../../components/SelectInput/SelectInput'

import FPSFinderLogo from '../../assets/images/logo.svg'
import graphicCardImage from '../../assets/images/graphic-card.svg'
import processorImage from '../../assets/images/processor.svg'
import ramMemoryImage from '../../assets/images/ram-memory.svg'

import './styles.css'

const Home = () => {
    const [ currentPopUp, setCurrentPopUp ] = useState({ id: 0, isVisible: false })
    const [ resultContainer, setResultContainer ] = useState(false)

    const [ selectedGraphicCard, setSelectedGraphicCard ] = useState('')
    const [ selectedProcessor, setSelectedProcessor ] = useState('')
    const [ selectedRamMemory, setSelectedRamMemory ] = useState('')
    
    const handleCurrentPopUpVisibility = event => {
        const status = !currentPopUp.isVisible
        const id = status ? event.target.id : 0

        if(status){
            window.scrollTo(0, 0)
            document.body.style.overflow = 'hidden'
        }
        else {
            document.body.style.overflow = 'initial'
        }

        setCurrentPopUp({ id, isVisible: status })
    }
    const handleSelectFields = () => {
        setSelectedGraphicCard('')
        setSelectedProcessor('')
        setSelectedRamMemory('')
    }

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
                        popUpID="graphic-card"
                        handlePopUp={handleCurrentPopUpVisibility}
                        handleSelectChange={handleGraphicCardChange}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'graphic-card') &&
                        
                        <PopUp closePopUp={handleCurrentPopUpVisibility} isVisible={currentPopUp.isVisible}>
                            <section className="popup-title">
                                <img src={graphicCardImage} alt="Placa Gráfica"/>
                                <h2>Placa Gráfica</h2>
                            </section>
                            <main>
                                <p>
                                A placa de vídeo é um dos principais componentes de qualquer pc, principalmente se seu foco é rodar jogos. A placa de vídeo é a peça responsável por gerar as imagens que você vê na tela.</p> 
                            </main>
                        </PopUp>
                    }
                </div>
                <div>
                    <SelectInput 
                        label="Processador" 
                        selectedOption={selectedProcessor} 
                        options={[]} 
                        popUpID="processor"
                        handlePopUp={handleCurrentPopUpVisibility}
                        handleSelectChange={handleProcessorChange}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'processor') &&
                        
                        <PopUp closePopUp={handleCurrentPopUpVisibility} isVisible={currentPopUp.isVisible}>
                            <section className="popup-title">
                                <img src={processorImage} alt="Processador"/>
                                <h2>Processador</h2>
                            </section>
                            <main>
                                <p>O processador é basicamente o cérebro de sua máquina. A função dele é acelerar, enviar, resolver ou preparar dados para os outros componentes do computador. </p> 
                            </main>
                        </PopUp>
                    }
                </div>
                <div>
                    <SelectInput 
                        label="Memória RAM" 
                        selectedOption={selectedRamMemory} 
                        options={[]}
                        popUpID="ram-memory"
                        handlePopUp={handleCurrentPopUpVisibility} 
                        handleSelectChange={handleRamMemoryChange}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'ram-memory') &&
                        
                        <PopUp closePopUp={handleCurrentPopUpVisibility} isVisible={currentPopUp.isVisible}>
                            <section className="popup-title">
                                <img src={ramMemoryImage} alt="Memória RAM"/>
                                <h2>Memória RAM</h2>
                            </section>
                            <main>
                                <p> A memória Ram é um componente que “conversa” com o processador e recebe os dados temporários de sua máquina, diferente do HD, que não é feito para dados temporários e é muito mais lento.</p> 
                            </main>
                        </PopUp>
                    }
                </div>

                <section className="operations-buttons">
                    <button className="btn main">Calcular</button>
                    <button className="btn" onClick={handleSelectFields}>Limpar campos</button>
                </section>
            </main>

            {resultContainer &&

                <div className="section-title">
                    <h1>RESULTADO</h1>
                </div>
            }

            
        </div>
    )
}

export default Home

//