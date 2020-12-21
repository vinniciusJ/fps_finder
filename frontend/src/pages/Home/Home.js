import React/*, { useState, useEffect }*/ from 'react'

//import api from '../../services/api'

import FPSFinderLogo from '../../assets/images/logo.svg'

import './styles.css'

const Home = () => {
    
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
        </div>
    )
}

export default Home