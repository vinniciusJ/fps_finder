import React, { useState } from 'react'
import { Search, Menu as MenuIcon, X } from 'react-feather'

import FPSFinderLogo from '../../assets/images/logo.svg'

import './styles.css'

const Menu = props => {
    const [ hiddenMenu, setHiddenMenu ] = useState(true)

    const handleMenuVisibility = () => setHiddenMenu(!hiddenMenu)

    return (
        <nav className="nav-bar">
            <div className={`nav-bar-inner ${!hiddenMenu ? 'extended' : ''}`}>
                <div className="nav-bar-logo">
                    <img width={120} height={80} src={FPSFinderLogo} alt="FPS Finder"/>
                </div>
                <div className="nav-bar-main">
                    <div className="nav-bar-links">
                        <a href="https://www.google.com/" target="_blank" rel="noreferrer">Blog</a>
                        <a href="https://www.google.com/" target="_blank" rel="noreferrer">Sobre nós</a>
                    </div>
                    <div className="nav-bar-input">
                        <Search color="#000" width={32} height={32}/>
                        <label htmlFor="search-input">
                            <input name="search-input" type="text" placeholder="Buscar..."/>
                        </label>
                    </div>
                </div>
                <div className="menu-icon">
                        { hiddenMenu && (
                            <MenuIcon onClick={handleMenuVisibility} color="#000" width={48} height={48}/>
                        ) }
                        { hiddenMenu || (
                            <X color="#000" onClick={handleMenuVisibility} width={48} height={48}/>
                        ) }
                </div>
            </div>
        </nav>
    )
}

export default Menu