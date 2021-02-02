import React, { useState, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import { AlertCircle } from 'react-feather'

import api from '../../services/api'

import PopUp from '../../components/PopUp/PopUp'
import SelectInput from '../../components/SelectInput/SelectInput'
import GameContainer from '../../components/GameContainer/GameContainer'
import Footer from '../../components/Footer/Footer'

import FPSFinderLogo from '../../assets/images/logo.svg'
import graphicCardImage from '../../assets/images/graphic-card.svg'
import processorImage from '../../assets/images/processor.svg'
import ramMemoryImage from '../../assets/images/ram-memory.svg'
import motherboardImage from '../../assets/images/motherboard.svg'

import './styles.css'

const Home = () => {
    const [ currentPopUp, setCurrentPopUp ] = useState({ id: '#', isVisible: false })
    const [ isAMobileDevice, setIsAMobileDevice ] = useState(false)
    const [ resultContainer, setResultContainer ] = useState(false)
    const [ games, setGames ] = useState([])

    const [ filteredCombination, setFilteredCombination ] = useState({})

    const [ selectedGraphicCard, setSelectedGraphicCard ] = useState(0)
    const [ selectedProcessor, setSelectedProcessor ] = useState(0)
    const [ selectedRamMemory, setSelectedRamMemory ] = useState(0)

    const [ graphicCardOptions, setGraphicCardOptions ] = useState([])
    const [ processorOptions, setProcessorOptions ] = useState([])
    const [ ramMemoryOptions, setRamMemoryOptions ] = useState([])

    const isValid = (value) => Number(value) !== 0 

    useEffect(() => {
        api.get('combinations', { params: {} }).then(response => {
            const combination = response.data

            setGraphicCardOptions(combination['graphic_card'])
            setProcessorOptions(combination['processor'])
            setRamMemoryOptions(combination['ram_memory'])        
        })  

        api.get('games', { params: { name: "" } }).then(response => {
            const receveidGames = response.data

            setGames(receveidGames)
        })

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
            setIsAMobileDevice(true)
    }, [  ])

    useEffect(() => {
        const filterOption = {}
        const components = [{ graphic_card: selectedGraphicCard }, { processor: selectedProcessor }, { ram_memory: selectedRamMemory }]

        components.forEach(component => {
            const [ key ] = Object.keys(component)
    
            if(isValid(component[key])) filterOption[key] = component[key]
        })

        if(Object.keys(filterOption).length === 3){
            api.get('combinations', { params: { ...filterOption } }).then(response => {
                const [ combination ] = response.data

                setFilteredCombination(combination)
            })
        }
        else {
            api.get('combinations', { params: {  ...filterOption } }).then(response => {
                const { graphic_card, processor, ram_memory } = response.data

                if(isValid(graphic_card.length)) setGraphicCardOptions(graphic_card)
                if(isValid(processor.length)) setProcessorOptions(processor)
                if(isValid(ram_memory.length)) setRamMemoryOptions(ram_memory)
            })
        }
    }, [ selectedGraphicCard, selectedProcessor, selectedRamMemory ])

    const handleCurrentPopUpVisibility = event => {
        const status = !currentPopUp.isVisible
        const id = event.target.id
    
        if(!status && id !== currentPopUp.id){
            setCurrentPopUp({ id, isVisible: true })
        }
        else {
            setCurrentPopUp({ id, isVisible: status })
        }

        if(isAMobileDevice){
            const { overflowY } = document.documentElement.style 
           
            document.documentElement.style.overflowY = overflowY === 'hidden' ? 'initial' : 'hidden'
        }
    }

    const clearSelectFields = () => {
        setSelectedGraphicCard(0)
        setSelectedProcessor(0)
        setSelectedRamMemory(0)
    }

    const handleCalculateAgain = () => {        
        setResultContainer(false)
        setFilteredCombination({})
        clearSelectFields() 
        
        return <Link to='#calculate' smooth/>
    }

    const handleProcessorChange = event => {
        const processor = event.target.value

        setSelectedProcessor(processor)
        isValid(event.target.value) && setProcessorOptions([event.target.value])
    }

    const handleRamMemoryChange = event => {
        const ramMemory = event.target.value

        setSelectedRamMemory(ramMemory)
        isValid(event.target.value) && setRamMemoryOptions([event.target.value])
    }

    const handleGraphicCardChange = event => {
        const graphicCard = event.target.value
        
        setSelectedGraphicCard(graphicCard)
        isValid(event.target.value) && setGraphicCardOptions([event.target.value])
    }

    const handleResultContainerView = () => {
        if(!isValid(selectedGraphicCard) || !isValid(selectedProcessor) || !isValid(selectedRamMemory)) return

        setResultContainer(true)
        
        return <Link to='#result' smooth/>
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

            <div className="section-title" id="calculate">
                <h1>CALCULAR</h1>
            </div>

            <main className="input-section">
                <div className="label-section">
                    <SelectInput 
                        label="Placa de Vídeo"
                        selectedOption={selectedGraphicCard}
                        options={graphicCardOptions} 
                        popUpID="graphic-card"
                        handlePopUp={handleCurrentPopUpVisibility}
                        handleSelectChange={handleGraphicCardChange}
                        isAMobileDevice={isAMobileDevice}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'graphic-card') &&
                        <PopUp 
                            closePopUp={handleCurrentPopUpVisibility} 
                            isVisible={currentPopUp.isVisible}
                            isAMobileDevice={isAMobileDevice}
                            id="component-graphic-card"
                        >
                            <section className="popup-title">
                                <img src={graphicCardImage} alt="Placa de Vídeo"/>
                                <h2>Placa de Vídeo</h2>
                            </section>
                            <main>
                                <p>
                                A placa de vídeo é um dos principais componentes de qualquer pc, principalmente se seu foco é rodar jogos. A placa de vídeo é a peça responsável por gerar as imagens que você vê na tela.</p> 
                            </main>
                        </PopUp>
                    }
                </div>
                <div className="label-section">
                    <SelectInput 
                        label="Processador" 
                        selectedOption={selectedProcessor} 
                        options={processorOptions} 
                        popUpID="processor"
                        handlePopUp={handleCurrentPopUpVisibility}
                        handleSelectChange={handleProcessorChange}
                        isAMobileDevice={isAMobileDevice}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'processor') &&
                        
                        <PopUp 
                            closePopUp={handleCurrentPopUpVisibility} 
                            isVisible={currentPopUp.isVisible}
                            isAMobileDevice={isAMobileDevice}
                            id="component-processor"
                        >
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
                <div className="label-section">
                    <SelectInput 
                        label="Memória RAM" 
                        selectedOption={selectedRamMemory} 
                        options={ramMemoryOptions}
                        popUpID="ram-memory"
                        handlePopUp={handleCurrentPopUpVisibility} 
                        handleSelectChange={handleRamMemoryChange}
                        isAMobileDevice={isAMobileDevice}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'ram-memory') &&
                        
                        <PopUp 
                            closePopUp={handleCurrentPopUpVisibility} 
                            isVisible={currentPopUp.isVisible}
                            isAMobileDevice={isAMobileDevice}
                            id="component-ram-memory"
                        >
                            <section className="popup-title">
                                <img src={ramMemoryImage} alt="Memória RAM"/>
                                <h2>Memória RAM</h2>
                            </section>
                            <main>
                                <p> A memória Ram é um componente que “conversa” com o processador e recebe os dados temporários de sua máquina, diferente do HD, que não é feito para dados temporários e é muito mais lento.</p> 
                            </main>
                        </PopUp>
                    }

                    <section className="operations-buttons">
                    <Link className="btn main" onClick={handleResultContainerView} smooth to={`#result`}>Calcular</Link>
                    <button className="btn" onClick={clearSelectFields}>Limpar campos</button>
                </section>
                </div>
            </main>

            {resultContainer &&
                
                <>
                <div className="section-title" id="result">
                    <h1>RESULTADO</h1>
                </div>
                <div className="result-container-div">
                    <section className="filter-combination" id="filter-combination">
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

                    <section className="games-container">
                        <h2>Jogos:</h2>

                        <div className="games-list">
                            {filteredCombination.FPSAverages.map(item => {
                                const [ game ] = games.filter(game => game.id === item.id_game)

                                return (
                                    <GameContainer name={game.name} logo={game.url_logo} FPSAverage={item.fps_average} key={game.id}/>
                                )
                            })}
                        </div>

                        <p className="games-container-info">
                            <AlertCircle color='black' strokeWidth={1.5} width={24} height={24}/>
                            Todos os testes foram realizados na qualidade média
                        </p>
                    </section>

                    <section className="btn-again">
                        <button className="btn main" onClick={handleCalculateAgain}>Calcular Novamente</button>
                    </section>
                </div>
                </>
                    
            }
            <Footer />
        </div>
        
    )
}

export default Home

//