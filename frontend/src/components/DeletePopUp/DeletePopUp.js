import React, { useRef, useState } from 'react'
import axios from 'axios'
import { AlertCircle } from "react-feather"

import './styles.css'

import api from '../../services/api'

const DeletePopUp = props => {
    const { id, name, handlePopupVisibility } = props
    const top = window.pageYOffset

    const inputName = useRef('')
    const [ isNameIncorrect, setIsNameIncorrect ] = useState(false) 

    const deleteCombination = async () => {
        const source = axios.CancelToken.source()

        if(inputName.current.value !== name) return setIsNameIncorrect(true)
        
        try{
            const response = await api.delete('/combinations', {  
                headers: { user: sessionStorage.getItem('user') }, 
                data: { id },
                cancelToken: source.token
            })
          
            response.status === 200 && handlePopupVisibility()
        }
        catch(error){
            console.log(error)
        }
       
        window.location.reload()

        return () => source.cancel('Ocorreu uma problema no processo de deletar a combinação.')
    }

    return (
        <div className="delete-popup" id="#delete" style={{ top }}>
            <div className="delete-popup-inner">
                <header className="delete-popup-header">
                    <h2>Tem certeza que deseja apagar a combinação "{name}"?</h2>
                    <p><AlertCircle width={20} height={20}/> A ação não poderá ser desfeita. </p>
                </header>
                <section className="delete-input-name">
                    <input required type="text" placeholder='Digite o nome da combinação...' ref={inputName} onKeyUp={() => setIsNameIncorrect(false)}/>
                    { isNameIncorrect && <p>O nome digitado está incorreto.</p> }
                </section>
                <footer className='delete-popup-footer'>
                    <button className="btn main" onClick={deleteCombination}>Apagar</button>
                    <button className="btn" onClick={handlePopupVisibility}>Cancelar</button>
                </footer>
            </div>
        </div>
    )
}

export default DeletePopUp