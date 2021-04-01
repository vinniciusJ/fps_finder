import React, { useState } from 'react'
import { Search, Menu as MenuIcon, X } from 'react-feather'
import { debounceEvent } from '../../utils/index'

import FPSFinderLogo from '../../assets/images/logo.svg'

import './styles.css'

const Menu = ({ searchInput, onSearch = () => {} }) => {
    const [ hiddenMenu, setHiddenMenu ] = useState(true)
    const [ searchButton, setSearchButton ] = useState(false)

    const handleMenuVisibility = () => setHiddenMenu(!hiddenMenu)
    const handleSearchButton = ({ status = !searchButton }) => setSearchButton(status)
        
    return (
        <nav className="nav-bar">
            <div className={`nav-bar-inner ${!hiddenMenu ? 'extended' : ''}`}>
                <a href="/" className="nav-bar-logo">
                    <img width={120} height={80} src={FPSFinderLogo} alt="FPS Finder"/>
                </a>
                <div className="nav-bar-main">
                    <div className="nav-bar-links">
                        <a href="https://www.google.com/" target="_blank" rel="noreferrer">Blog</a>
                        <a href="/about-us" >Sobre nós</a>
                    </div>

                    {searchInput.isVisible && (
                        <div className="nav-bar-input">
                            <Search  
                                className={searchButton ? 'clicked' : ''} color="#000" 
                                width={28} 
                                height={28} 
                                onClick={handleSearchButton}
                            />
                            <label htmlFor="search-input">
                                <input 
                                    name="search-input" 
                                    id="search-input" 
                                    type="text" 
                                    placeholder="Buscar..."
                                    onKeyUp={event => {
                                        handleSearchButton({ status: true })
                                        debounceEvent(onSearch).apply(null, event)
                                    }}
                                />
                            </label>
                        </div>
                    )}

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