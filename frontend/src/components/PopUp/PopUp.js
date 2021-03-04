import React, { useEffect, useState } from 'react'
import LazyLoad from 'react-lazy-load'
import { X } from 'react-feather'

import './styles.css'

const PopUp = props => {  
    const [ position, setPosition ] = useState({ top: 38 })

    useEffect(() => props.isAMobileDevice && setPosition({ top: window.pageYOffset }), [ props.isAMobileDevice ])

    return (
        <div style={position} className="popup" data-isvisible={props.isVisible} id={props.id}>
            <div className="popup-inner">
                <header onClick={props.closePopUp}>
                    <LazyLoad><X width={32} height={32}/></LazyLoad>
                </header>
                {props.children}
            </div>
        </div>
    )
}

export default PopUp