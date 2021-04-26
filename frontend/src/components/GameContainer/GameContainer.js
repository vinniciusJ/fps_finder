import './styles.css'

const GameContainer = props => {
    const { background } = props
    
    const style = {
        div: { background: '#FFF' },
        span: { color: 'var(--main-color)' }
    }
    
    const isWhite = background === '#FFF'

    return  (
        <div className="game-container" style={isWhite ? style.div : {}}>
            <div className="game-logo">

                <img width={33.6} height={33.6} src={`/images/icons/${props.logo}`} alt={props.name}/>

                <p>{props.name}</p>
            </div>
            <div className="game-fps">
                <p><span style={isWhite ? style.span : {}}>Média FPS: </span>{props.FPSAverage}</p>
            </div>
        </div>
    )
}

export default GameContainer