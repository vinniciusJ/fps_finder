import React, { useState, useEffect } from 'react'

import api from '../../services/api'

import PopUp from '../../components/PopUp/PopUp'
import SelectInput from '../../components/SelectInput/SelectInput'

import FPSFinderLogo from '../../assets/images/logo.svg'
import graphicCardImage from '../../assets/images/graphic-card.svg'
import processorImage from '../../assets/images/processor.svg'
import ramMemoryImage from '../../assets/images/ram-memory.svg'
import motherboardImage from '../../assets/images/motherboard.svg'

import './styles.css'

const Home = () => {
    const [ currentPopUp, setCurrentPopUp ] = useState({ id: 0, isVisible: false })
    const [ resultContainer, setResultContainer ] = useState(true)
    const [ requestStatus, setRequestStatus ] = useState(false)

    //const [ filterComponents, setFilterComponents ] = useState({})
    const [ filteredCombination, setFilteredCombination ] = useState({})

    const [ selectedGraphicCard, setSelectedGraphicCard ] = useState(0)
    const [ selectedProcessor, setSelectedProcessor ] = useState(0)
    const [ selectedRamMemory, setSelectedRamMemory ] = useState(0)

    const [ graphicCardOptions, setGraphicCardOptions ] = useState([])
    const [ processorOptions, setProcessorOptions ] = useState([])
    const [ ramMemoryOptions, setRamMemoryOptions ] = useState([])

    useEffect(() => {
        api.get('combinations', { params: { components: {} } }).then(response => {
            const combination = response.data

            setGraphicCardOptions(combination['graphic_card'])
            setProcessorOptions(combination['processor'])
            setRamMemoryOptions(combination['ram_memory'])        
        })  
    }, [  ])

    useEffect(() => {
        const filterOption = {}
        const components = [{graphic_card: selectedGraphicCard}, {processor: selectedProcessor}, {ram_memory: selectedRamMemory}]

        components.forEach(component => {
            const [ key ] = Object.keys(component)
    
            if(component[key] !== 0 && component[key] !== '0') filterOption[key] = component[key]
        })

        if(Object.keys(filterOption).length === 3){
            api.get('combinations', { params: { components: { ...filterOption } } }).then(response => {
                const [ combination ] = response.data

                setFilteredCombination(combination)
            })
        }
        else {
            api.get('combinations', { params: { components: { ...filterOption } } }).then(response => {
                const { graphic_card, processor, ram_memory } = response.data

                if(graphic_card.length !== 0) setGraphicCardOptions(graphic_card)
                if(processor.length !== 0) setProcessorOptions(processor)
                if(ram_memory.length !== 0) setRamMemoryOptions(ram_memory)
            })
        }
    }, [ selectedGraphicCard, selectedProcessor, selectedRamMemory ])

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
        setSelectedGraphicCard(0)
        setSelectedProcessor(0)
        setSelectedRamMemory(0)
    }

    const handleProcessorChange = event => {
        const processor = event.target.value

        setSelectedProcessor(processor)

        event.target.value !== '0' && setProcessorOptions([event.target.value])
    }

    const handleRamMemoryChange = event => {
        const ramMemory = event.target.value

        setSelectedRamMemory(ramMemory)
        
        event.target.value !== '0' && setRamMemoryOptions([event.target.value])
    }

    const handleGraphicCardChange = event => {
        const graphicCard = event.target.value
        
        setSelectedGraphicCard(graphicCard)

        event.target.value !== '0' && setGraphicCardOptions([event.target.value])
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
                        options={graphicCardOptions} 
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
                        options={processorOptions} 
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
                        options={ramMemoryOptions}
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
                    <button className="btn main" onClick={() => setRequestStatus(true)}>Calcular</button>
                    <button className="btn" onClick={handleSelectFields}>Limpar campos</button>
                </section>
            </main>

            {resultContainer &&
                <>
                    <div className="section-title">
                        <h1>RESULTADO</h1>
                    </div>

                    <section className="filter-combination">
                        <h2>Peças escolhidas: </h2>

                        <div className="filter-components">
                            <ul>
                                <li><span>Placa de Vídeo: </span>{filteredCombination.graphic_card}</li>
                                <li><span>Processador: </span>{filteredCombination.processor}</li>
                                <li><span>Memória RAM: </span>{filteredCombination.ram_memory}</li>
                            </ul>
                        </div>
                    </section>

                    <section className="motherboard">
                        <h2>Placa Mãe recomendada: </h2>

                        <div className="motherboard-box">
                            <img src={motherboardImage} alt="Placa Mãe recomendada"/>
                            <p>{filteredCombination.motherboard}</p>
                        </div>
                    </section>
                </>
            }

            
        </div>
    )
}

export default Home

//