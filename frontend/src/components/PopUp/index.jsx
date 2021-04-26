import React, { useEffect, useState } from 'react'
import { X } from 'react-feather'

import './styles.css'

const PopUp = props => {  
    const [ position, setPosition ] = useState({ top: 38 })

    useEffect(() => props.isAMobileDevice && setPosition({ top: window.pageYOffset }), [ props.isAMobileDevice ])

    return (
        <div style={position} className="popup" data-isvisible={props.isVisible} id={props.id}>
            <div className="popup-inner">
                <header onClick={props.closePopUp}>
                    <X width={32} height={32}/>
                </header>
                {props.children}
            </div>
        </div>
    )
}

export default PopUp