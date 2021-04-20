import React, { useRef, useState , useEffect} from 'react'
import axios from 'axios'

import { AlertCircle } from "react-feather"
import { calculatorAPI, blogAPI } from '../../services/api'

import './styles.css'

const DeletePopUp = ({ type, id, confirmText, handleVisibility}) => {
    const inputName = useRef('')

    const [ position, setPosition ] = useState({ top: 0 })
    const [ isTextCorrect, setIsTextCorrect ] = useState(true) 

    useEffect(() => {
        document.documentElement.style.overflowY = 'hidden'

        setPosition({ top: window.pageYOffset })
    }, [])

    const onCancel = () => {
        document.body.style.overflow = 'initial'

        handleVisibility()
    }

    const deleteCombination = async () => {
        const source = axios.CancelToken.source()

        if(inputName.current.value !== confirmText) return setIsTextCorrect(false)
        
        try{
            let response = null

            if(type === 'combination'){
                response = await calculatorAPI.delete('/combinations', {  
                    headers: { user: sessionStorage.getItem('user') }, 
                    data: { id },
                    cancelToken: source.token
                })

                window.location.reload()
            }
            else {
                response = await blogAPI.delete(`/blog/${id}/`, { cancelToken: source.token })
            }
          
            if(response.status === 200) document.body.style.overflow = 'initial'
        }
        catch(error){
            console.log(error)
        }

        return () => source.cancel('Ocorreu uma problema no processo de deletar a combinação.')
    }

    return (
        <div className="delete-popup" style={position}>
            <div className="delete-popup-inner">
                <header className="delete-popup-header">
                    <h2>Tem certeza que deseja apagar a {type === 'post' ? 'postagem' : 'combinação'} "{confirmText}"?</h2>
                    <p><AlertCircle width={20} height={20}/> A ação não poderá ser desfeita. </p>
                </header>
                <section className="delete-input-name">
                    <input required type="text" placeholder='Digite o nome da combinação...' ref={inputName} onKeyUp={() => setIsTextCorrect(false)}/>
                    { isTextCorrect || <p>O nome digitado está incorreto.</p> }
                </section>
                <footer className='delete-popup-footer'>
                    <button className="btn main two" onClick={deleteCombination}>Apagar</button>
                    <button className="btn" onClick={onCancel}>Cancelar</button>
                </footer>
            </div>
        </div>
    )
}

export default DeletePopUp