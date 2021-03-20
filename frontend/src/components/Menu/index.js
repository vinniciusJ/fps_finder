import React from 'react'
import { Search } from 'react-feather'

import FPSFinderLogo from '../../assets/images/logo.svg'

import './styles.css'

const Menu = props => {
    return (
        <nav className="nav-bar">
            <div className="nav-bar-logo">
                <img width={64} height={40} src={FPSFinderLogo} alt="FPS Finder"/>
            </div>
            <div className="nav-bar-main">
                <div className="nav-bar-links">
                    <a href="https://www.google.com/" target="_blank" rel="noreferrer">Blog</a>
                    <a href="https://www.google.com/" target="_blank" rel="noreferrer">Sobre nós</a>
                </div>
                <div className="nav-bar-input">
                    <Search color="#000" width={32} height={32}/>
                    <label htmlFor="search-input">
                        <input name="search-input" type="text"/>
                    </label>
                </div>
                <div className="hamburguer-icon x">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </nav>
    )
}

export default Menu