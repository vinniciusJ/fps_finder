import React, { Suspense, lazy, useState, useEffect } from 'react'
import axios from 'axios'
import fakeData from './data.json'

import { slugify} from '../../utils/index'
import { Plus, Edit3 } from 'react-feather'
import { blogAPI } from '../../services/api'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'

import './styles.css'

const ImagePopup = lazy(() => import('../../components/ImagePopup'))
const TextEditor = lazy(() => import('../../components/TextEditor'))

const Post = props => {
    const { id } = useParams(), history = useHistory(), user = sessionStorage.getItem('user')

    const [ imagePopup, setImagePopup ] = useState(false)
    const [ bannerPreview, setBannerPreview ] = useState(false)
    const [ editorState, setEditorState ] = useState(EditorState.createEmpty())
    const [ postHeader, setPostHeader ] = useState({ title: null, banner: { src: null, type: null, font: null, file: null } })
 
    useEffect(() => (async () => {
        if(!id) return

        const source = axios.CancelToken.source()

        try{
            const { title, banner, bannerFont, content } = fakeData

            const contentState = convertFromRaw(JSON.parse(content))

            setBannerPreview(true)
            setEditorState(EditorState.createWithContent(contentState))
            setPostHeader({ title, banner: { src: banner, type: 'pasted', font: bannerFont, file: null } })
        }
        catch(error){
            alert(error.message)
        }
        
        return () => source.cancel("Requisição Cancelada")
    })(), [ id ])
    
    const handleTitleInput = ({ target: { value } }) => {
        const { banner } = postHeader

        setPostHeader({ title: value, banner })
    }

    const handleImagePopupVisibility = event => {
        event.preventDefault()

        const overflowY  = document.documentElement.style.overflowY || 'initial'
           
        document.documentElement.style.overflowY = overflowY === 'initial' ? 'hidden' : 'initial'

        setImagePopup(!imagePopup)
        setBannerPreview(postHeader.banner.src ? true : false)
    }

    const handleFontInput = ({ target: { value } }) => {
        const { title, banner: { src, type } } = postHeader

        setPostHeader({ title, banner: { src, type, font: value } })
    }

    const handleImageChange = ({ src, file: newFile, type }) => {
        const { title, banner: { font, file } } = postHeader

        if(newFile){
            const reader = new FileReader()
    
            reader.readAsDataURL(newFile)
            reader.onload = ({ target: { result } }) => setPostHeader({ title, banner: { src: result, file: newFile, type, font } })

            return
        }

        setPostHeader({ title, banner: { src, file, type, font } })
    }

    const onCancel = (event) => {
        event.preventDefault()

        history.push('/admin')
    }

    const onSave = async event => {
        event.preventDefault()

        const images = new FormData()
        const source = axios.CancelToken.source()
        const published = event.target.dataset.publish ? true : false

        const { title, banner } = postHeader
        const { blocks, entityMap } = convertToRaw(editorState.getCurrentContent())

        if(!(banner.src || banner.file ) || !title) return alert('Por favor, preencha todos os campos')

        if(banner.file) images.append(banner.file.name, banner.file)

        Object.values(entityMap).forEach((entity, key) => {
            if(entity.type === 'image' && entity.data.file) images.append(entity.data.file.name, entity.data.file)
        })

        try{
            const sources = await blogAPI.post('/files', images)

            const entityImages = Object.values(entityMap).filter(entity => entity.type === `image`)

            const finalEntityMap = {...Object.values(entityImages).map(entity => {
                if(!entity.data.file) return entity

                return { ...entity, data: {  ...entity.data, file: null, src: sources[entity.data.file.name] } } 
            })}

           /* const post = { 
                title, 
                slang: slugify({ text: title }),
                font_banner: banner.font,
                banner_link: banner.src, 
                content: JSON.stringify({ blocks, entityMap: finalEntityMap }), 
                published 
            }
            
            const registeredPost = await blogAPI('/', post)*/

            console.log(sources, finalEntityMap)
        }
        catch(error){
            alert(error.message)
        }

        //history.push('/admin')
        
        return () => source.cancel("Requisição Cancelada")
    }

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
                                <input type="text" value={postHeader.title ?? ' '} name="title" id="title" placeholder="Escreva aqui..." onChange={handleTitleInput}/>
                            </div>
                            {(bannerPreview) || (
                                <div className="post-input">
                                    <label htmlFor="">Banner:</label>
                                    <button className="banner-button" title="Selecione uma imagem" onClick={handleImagePopupVisibility}>
                                        <Plus color="#000" width={56} height={56} strokeWidth={1}/>
                                    </button>
                                </div>
                            )}

                            {(bannerPreview) && (
                                <>
                                <h2 className="label">Banner:</h2>
                                <div className="banner-preview">
                                    <figure>
                                        <img src={postHeader.banner.src} alt={postHeader.banner.font}/>
                                        <figcaption><strong>Fonte: </strong> {postHeader.banner.font}</figcaption>
                                    </figure>

                                    <button className="banner-edit" onClick={handleImagePopupVisibility} title="Editar banner">
                                        <Edit3 color="#FFF" width={32} height={32} strokeWidth={1}/>
                                    </button>
                                </div>
                                </>
                            )}

                            <div className="content-input">
                                <h2 className="label">Conteúdo:</h2>
                                <Suspense fallback={<div></div>}>
                                    <TextEditor editorState={editorState} onChange={setEditorState}/>
                                </Suspense>
                            </div>

                            <div className="post-btns-opts">
                                <button className="btn main" onClick={onSave}>Salvar</button>
                                <button className="btn" onClick={onCancel}>Cancelar</button>
                                <button className="btn" data-publish onClick={onSave}>Publicar</button>
                            </div>
                        </form>
                    </main>

                    
                    {imagePopup && (
                        <Suspense fallback={<div></div>}>
                            <ImagePopup 
                                image={postHeader.banner}
                                onChangeImage={handleImageChange}
                                onFontInput={handleFontInput}
                                onSave={handleImagePopupVisibility}
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