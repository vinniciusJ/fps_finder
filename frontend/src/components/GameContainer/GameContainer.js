import React, { useState, useEffect } from 'react' 
import './styles.css'

const GameContainer = props => {
    const { background } = props
    
    const [ logo, setLogo ] = useState('')

    const containerStyle = {
        background: '#FFF'
    }

    const spanStyle = {
        color: 'var(--main-color)'
    }

    const isWhite = background === '#FFF'

    useEffect(() => import(`../../assets/icons/${props.logo}`).then(response => setLogo(response.default)), [ props.logo ])
    
    return  (
        <div className="game-container" style={isWhite ? containerStyle : {}}>
            <div className="game-logo">
                <img src={logo} alt={props.name}/>
                <p>{props.name}</p>
            </div>
            <div className="game-fps">
                <p><span style={isWhite ? spanStyle : {}}>Média de FPS: </span>{props.FPSAverage}</p>
            </div>
        </div>
    )
}

export default GameContainer