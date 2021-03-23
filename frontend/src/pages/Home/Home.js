import React, { useState, useEffect, Suspense, lazy } from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import { AlertCircle } from 'react-feather'
import axios from 'axios'

import api from '../../services/api'

import graphicCardImage from '../../assets/images/graphic-card.svg'
import processorImage from '../../assets/images/processor.svg'
import ramMemoryImage from '../../assets/images/ram-memory.svg'
import motherboardImage from '../../assets/images/motherboard.svg'

import './styles.css'

const SelectInput = lazy(() => import('../../components/SelectInput/SelectInput'))
const PopUp = lazy(() => import('../../components/PopUp/PopUp'))
const GameContainer = lazy(() => import('../../components/GameContainer/GameContainer'))
const Footer = lazy(() => import('../../components/Footer/Footer'))

const Menu = lazy(() => import('../../components/Menu/index'))

const componentsInterface = { graphic_card: null, processor: null, ram_memory: null }

const Home = () => {
    const [ currentPopUp, setCurrentPopUp ] = useState({ id: '#', isVisible: false })
    const [ resultContainer, setResultContainer ] = useState(false)
    const [ isAMobileDevice, setIsAMobileDevice ] = useState(false)

    const [ games, setGames ] = useState([])

    const [ filteredCombination, setFilteredCombination ] = useState({})
    const [ filteredComponents, setFilteredComponents ] = useState([])

    const [ components, setComponents ] = useState([{ ...componentsInterface }])
    const [ selectedComponents, setSelectedComponents ] = useState({ ...componentsInterface })

    const [ selectComponents, setSelectComponents ] = useState({ graphic_card: [], processor: [], ram_memory: [] })

    useEffect(() => {
        (async () => {
            const source = axios.CancelToken.source()

            try{
                const receivedComponents = await (await api.get('/components', { cancelToken: source.token })).data
                const receivedGames = await (await api.get('games', { cancelToken: source.token })).data
                
                const filteredComponents = { graphic_card: [], processor: [], ram_memory: [] }

                receivedComponents.forEach(component => Object.keys(component).forEach(key => filteredComponents[key].push(component[key])))

                Object.keys(filteredComponents).forEach(key => filteredComponents[key] = [ ...new Set(filteredComponents[key])])

                setGames(receivedGames)
                setSelectComponents(filteredComponents)
                setComponents(receivedComponents)
            }
            catch(error){
                alert(error.message)
            }

            return () => source.cancel("Requisição Cancelada")
        })()

        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

        if(mobile.test(navigator.userAgent) && window.matchMedia('(max-width: 414px)').matches)
            setIsAMobileDevice(true)  
            
    }, [  ])

    useEffect(() => {
        const isThereASingleValue = ({ key }) => selectComponents[key].length === 1

        const selectComponentsKeys = Object.keys(selectComponents), newSelectedComponents = { ...selectedComponents }

        selectComponentsKeys.forEach(key => {
            const value = isThereASingleValue({ key }) ? selectComponents[key][0] : null

            newSelectedComponents[key] = value === '0' ? null : value
        })

        if(JSON.stringify(selectedComponents) !== JSON.stringify(newSelectedComponents))
            setSelectedComponents(newSelectedComponents)

    }, [ selectComponents, selectedComponents ])

    const handleSelectChanges = event => {
        const splitComponents = ({ key, components }) => components.map(items => items[key])
        const filterComponents = ({ components, param }) => components.filter(component => component[key0] === param)

        const isTheComponentSelected = ({ key }) => selectedComponents[key]

        const { id: key0, value: selectedComponent } = event.target
        const [ key1, key2 ] = Object.keys(selectComponents).filter(key => key !== key0)

        let newFilteredComponents = filterComponents({
            components: (filteredComponents.length ? filteredComponents : components),
            param: selectedComponent
        })

        const [ component1, component2 ] = [
            (isTheComponentSelected({ key: key1 }) || splitComponents({ key: key1, components: newFilteredComponents })),
            (isTheComponentSelected({ key: key2 }) || splitComponents({ key: key2, components: newFilteredComponents }))
        ]

        setFilteredComponents(newFilteredComponents)

        setSelectComponents({ 
            [key0]: [selectedComponent ? selectedComponent : null],
            [key1]: Array.isArray(component1) ? component1 : [component1], 
            [key2]: Array.isArray(component2) ? component2 : [component2]
        })
    }

    const handleCurrentPopUpVisibility = event => {
        const status = currentPopUp.isVisible
        const id = event.target.id.split('popup-')[1]

        if(!status && id)
            setCurrentPopUp({ id, isVisible: true })
        
        else if(status && id === currentPopUp.id)
            setCurrentPopUp({ id, isVisible: false })
        else
            setCurrentPopUp({ id, isVisible: status })
        
        if(isAMobileDevice){
            const { overflowY } = document.documentElement.style 
           
            document.documentElement.style.overflowY = overflowY === 'hidden' ? 'initial' : 'hidden'
        }
    }

    const clearSelectFields = () => {
        const restoredSelectComponents = { ...selectComponents }
        
        components.forEach(component => Object.keys(component).forEach(key => restoredSelectComponents[key].push(component[key])))
        Object.keys(restoredSelectComponents).forEach(key => restoredSelectComponents[key] = [ ...new Set(restoredSelectComponents[key])])

        setFilteredComponents([])
        setSelectComponents(restoredSelectComponents)
        setSelectedComponents({ graphic_card: null, processor: null, ram_memory: null })
    }

    const calculateAgain = () => {        
        setResultContainer(false)
        setFilteredCombination({})

        clearSelectFields() 
    }


    const calculateFPSAverage = async () => {
        if(Object.values(selectedComponents).includes(null)) return alert('Por favor, selecione todos os inputs.')

        const source = axios.CancelToken.source()

        try{
            const { data: combination } = await (
                await api.get('/combinations', { params: { ...selectedComponents }, cancelToken: source.token })
            )

            setFilteredCombination(combination)
        }
        catch(error){
            alert(error.message)
        }

        setResultContainer(true)
    }

    return (
        <div className="Home">
            <Suspense fallback={<div></div>}>
                <Menu searchInput={{ isVisible: false }} onSearch={() => {}}/>
            </Suspense>
            <header className="main-header">
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
                    <Suspense fallback={<div></div>}>
                        <SelectInput 
                            label="Placa de Vídeo"
                            id="graphic_card"
                            popUpID="popup-graphic-card"

                            selectedOption={selectedComponents.graphic_card}
                            options={selectComponents.graphic_card} 
                            isAMobileDevice={isAMobileDevice}

                            handlePopUp={handleCurrentPopUpVisibility}
                            handleSelectChange={handleSelectChanges}
                        />
                    </Suspense>

                    {(currentPopUp.isVisible && currentPopUp.id === 'graphic-card') &&
                        <Suspense fallback={<div></div>}>
                            <PopUp 
                                closePopUp={handleCurrentPopUpVisibility} 
                                isVisible={currentPopUp.isVisible}
                                isAMobileDevice={isAMobileDevice}
                                id="component-graphic-card"
                            >
                                <section className="popup-title">
                                    
                                    <img width={isAMobileDevice ? 76 : 32} height={isAMobileDevice ? 76 : 32} src={graphicCardImage} alt="Placa de Vídeo"/>
                                    <h2>Placa de Vídeo</h2>
                                </section>
                                <main>
                                    <p>
                                    A placa de vídeo é um dos principais componentes de qualquer pc, principalmente se seu foco é rodar jogos. A placa de vídeo é a peça responsável por gerar as imagens que você vê na tela.</p> 
                                </main>
                            </PopUp>
                        </Suspense>
                    }
                </div>
                <div className="label-section">
                    <Suspense fallback={<div></div>}>
                        <SelectInput 
                            label="Processador"
                            id="processor" 
                            popUpID="popup-processor"

                            selectedOption={selectedComponents.processor} 
                            options={selectComponents.processor} 
                            isAMobileDevice={isAMobileDevice}
                            
                            handlePopUp={handleCurrentPopUpVisibility}
                            handleSelectChange={handleSelectChanges}
                        />
                    </Suspense>

                    {(currentPopUp.isVisible && currentPopUp.id === 'processor') &&
                        <Suspense fallback={<div></div>}>
                            <PopUp 
                                closePopUp={handleCurrentPopUpVisibility} 
                                isVisible={currentPopUp.isVisible}
                                isAMobileDevice={isAMobileDevice}
                                id="component-processor"
                            >
                                <section className="popup-title">
                                    <img width={isAMobileDevice ? 76 : 32} height={isAMobileDevice ? 76 : 32}  src={processorImage} alt="Processador"/>
                                    <h2>Processador</h2>
                                </section>
                                <main>
                                    <p>O processador é basicamente o cérebro de sua máquina. A função dele é acelerar, enviar, resolver ou preparar dados para os outros componentes do computador. </p> 
                                </main>
                            </PopUp>
                        </Suspense>
                    }
                </div>
                <div className="label-section">
                    <Suspense fallback={<div></div>}>
                        <SelectInput 
                            label="Memória RAM" 
                            id="ram_memory"
                            popUpID="popup-ram-memory"

                            selectedOption={selectedComponents.ram_memory} 
                            options={selectComponents.ram_memory}
                            isAMobileDevice={isAMobileDevice}
                            
                            handlePopUp={handleCurrentPopUpVisibility} 
                            handleSelectChange={handleSelectChanges}
                        />
                    </Suspense>

                    {(currentPopUp.isVisible && currentPopUp.id === 'ram-memory') &&
                        <Suspense fallback={<div></div>}>
                            <PopUp 
                                closePopUp={handleCurrentPopUpVisibility} 
                                isVisible={currentPopUp.isVisible}
                                isAMobileDevice={isAMobileDevice}
                                id="component-ram-memory"
                            >
                                <section className="popup-title">
                                    <img width={isAMobileDevice ? 76 : 32} height={isAMobileDevice ? 76 : 32}  src={ramMemoryImage} alt="Memória RAM"/>
                                    <h2>Memória RAM</h2>
                                </section>
                                <main>
                                    <p> A memória Ram é um componente que “conversa” com o processador e recebe os dados temporários de sua máquina, diferente do HD, que não é feito para dados temporários e é muito mais lento.</p> 
                                </main>
                            </PopUp>
                        </Suspense>
                    }

                    <section className="operations-buttons">
                        <Link className="btn main" onClick={calculateFPSAverage} smooth to={`#result`}>Calcular</Link>
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
                                <li>
                                    <div>
                                        <span>Placa de Vídeo: </span>{filteredCombination.graphic_card}
                                    </div>

                                    {!filteredCombination.graphic_card_link && (
                                        <a href={filteredCombination.graphic_card_link || 'https://www.google.com/'}  className="purchase-link" target="_blank" rel="noreferrer">Onde comprar</a>
                                    )}
                                </li>
                                <li>
                                    <div>
                                        <span>Processador: </span>{filteredCombination.processor}
                                    </div>

                                    {!filteredCombination.processor_link && (
                                        <a href={filteredCombination.processor_link || 'https://www.google.com/'}  className="purchase-link" target="_blank" rel="noreferrer">Onde comprar</a>
                                    )}
                                </li>
                                <li>
                                    <div><span>Memória RAM: </span>{filteredCombination.ram_memory}</div>

                                    {!filteredCombination.ram_memory_link && (
                                        <a href={filteredCombination.ram_memory_link || 'https://www.google.com/'}  className="purchase-link" target="_blank" rel="noreferrer">Onde comprar</a>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="motherboard">
                        <h2>Placa Mãe recomendada: </h2>

                        <div className="motherboard-box">
                            <div>
                                <img src={motherboardImage} width={32} height={32} alt="Placa Mãe recomendada"/>
                                <p>{filteredCombination.motherboard}</p>
                            </div>

                            {!filteredCombination.motherboard_link && (
                                <a href={filteredCombination.motherboard_link || 'https://www.google.com/'}  className="purchase-link" target="_blank" rel="noreferrer">Onde comprar</a>
                            )}
                        </div>
                    </section>

                    <section className="games-container">
                        <h2>Jogos:</h2>

                        <div className="games-list">
                            {filteredCombination.fps_averages.map(item => {
                                const [ game ] = games.filter(game => game.id === item.id_game)

                                return (
                                    <Suspense key={game.id} fallback={<div></div>}>
                                        <GameContainer name={game.name} logo={game.url_logo} FPSAverage={item.fps_average}/>
                                    </Suspense>
                                )
                            })}
                        </div>

                        <p className="games-container-info">
                            <AlertCircle color='black' strokeWidth={1.5} width={isAMobileDevice ? 48 : 32} height={isAMobileDevice ? 48 : 32}/>
                            Todos os testes foram realizados na qualidade média e em 1080p
                        </p>
                    </section>

                    <section className="btn-again">
                        <Link className="btn main" onClick={calculateAgain} smooth to={`#calculate`}>Calcular Novamente</Link>
                    </section>
                </div>
                </>
                    
            }

            <Suspense fallback={<div></div>}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default Home