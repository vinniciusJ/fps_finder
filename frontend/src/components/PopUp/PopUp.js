import React from 'react'
import { X } from 'react-feather'

import './styles.css'

const PopUp = props => (
    <div className="popup">
        <div className="popup-inner">
            <header><X width={32} height={32}/></header>
            {props.children}
        </div>
    </div>
)

export default PopUp