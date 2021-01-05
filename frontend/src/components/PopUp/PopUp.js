import React from 'react'
import { X } from 'react-feather'

import './styles.css'

const PopUp = props => (
    <div className="popup" data-isvisible={props.isVisible} id={props.id}>
        <div className="popup-inner">
            <header onClick={props.closePopUp}><X width={32} height={32}/></header>
            {props.children}
        </div>
    </div>
)

export default PopUp