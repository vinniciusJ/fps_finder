import React, { Suspense, lazy, useState } from 'react'

import { Redirect, useParams, useHistory } from 'react-router-dom'
import { Plus, Edit3 } from 'react-feather'

import './styles.css'

const AddImagePopup = lazy(() => import('../../components/AddImagePopup'))

const Post = props => {
    const id = useParams(), history = useHistory()

    const [ addImagePopup, setAddImagePopup ] = useState(false)
    const [ bannerPreview, setBannerPreview ] = useState(false)

    const [ postHeader, setPostHeader ] = useState({ title: null, banner: { src: null, font: null } })
 
    const handleImagePopupVisibility = event => {
        event.preventDefault()

        setAddImagePopup(!addImagePopup)
    }

    const handleURLInput = value => {
        console.log(value)
    }

    const handleFontInput = ({ target: { value } }) => {
        const { title, banner: { src } } = postHeader

        setPostHeader({ title, banner: { src, font: value } })
    }

    const handleImageChange = event => {
        if(event.target.type === 'url') return handleURLInput

        const file = event.target.files.item(0)
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = ({ target: { result } }) => {
            const { title, banner: { font } } = postHeader

            setPostHeader({ title, banner: { src: result, font } })
        }
    }

    const user = sessionStorage.getItem('user')

    return (
        <div className="Post">
            {user ? (
                <>
                    <header className="post-header">
                        <h2>{id ? 'Editar post: ' : 'Criar um post: '}</h2>
                    </header>
                    <main className="post-data-container">
                        <form className="post-form">
                            <div className="post-input">
                                <label htmlFor="title">Título:</label>
                                <input type="text" name="title" id="title" placeholder="Escreva aqui..."/>
                            </div>
                            {bannerPreview || (
                                <div className="post-input">
                                    <label htmlFor="">Banner:</label>
                                    <button className="banner-button" title="Selecione uma imagem" onClick={handleImagePopupVisibility}>
                                        <Plus color="#000" width={56} height={56} strokeWidth={1}/>
                                    </button>
                                </div>
                            )}

                            {bannerPreview && (
                                <div className="banner-preview">
                                    <figure>
                                        <img src={postHeader.banner.src} alt={postHeader.banner.font}/>
                                        <figcaption><span className="font">Fonte: </span> {postHeader.banner.font}</figcaption>
                                    </figure>

                                    <button className="banner-edit">
                                        <Edit3 color="#FFF" width={32} height={32} strokeWidth={1}/>
                                    </button>
                                </div>
                            )}
                        </form>
                    </main>

                    
                    {addImagePopup && (
                        <Suspense fallback={<div></div>}>
                            <AddImagePopup 
                                isThereAnImage={false}
                                onChangeImage={handleImageChange}
                                onFontInput={handleFontInput}
                                onSave={() => {
                                    setBannerPreview(true)
                                    setAddImagePopup(false)
                                }}
                                onCancel={handleImagePopupVisibility}
                            />
                        </Suspense>
                    )}
                </>
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
            )}
        </div>
    )
}

export default Post