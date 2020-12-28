import React from 'react'

import './styles.css'

const GameContainer = (props) => (
    <div className="game-container">
        <div className="game-logo">
            <img src={props.URLLogo} alt={props.name}/>
            <p>{props.name}</p>
        </div>
        <div className="game-fps">
            <p><span>Média de FPS: </span>{props.FPSAverage}</p>
        </div>
    </div>
)

export default GameContainer