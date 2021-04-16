import React, { Suspense, lazy, useState, useEffect } from 'react'
import Editor from 'draft-js-plugins-editor'

import { RichUtils, EditorState, AtomicBlockUtils } from 'draft-js'
import { createTextColorPlugin, createHighlightPlugin, createLinkPlugin } from './plugins'
import { entityBlockRenderer } from './Entities/mediaBlockRenderer'

import './styles.css'

const EditorOptions = lazy(() => import('./EditorOptions'))

const TextEditor = ({ editorState, onChange }) => {
    const [ activeButtons, setActiveButtons ] = useState([])

    const [ plugins, setPlugins ] = useState([ 
        createTextColorPlugin({}), 
        createHighlightPlugin({}),
        createLinkPlugin()
    ])

    useEffect(() => {
        const newActivesButtons = activeButtons.filter(activeButton => editorState.getCurrentInlineStyle().has(activeButton))

        if(JSON.stringify(activeButtons) === JSON.stringify(newActivesButtons)) return

        setActiveButtons(newActivesButtons)
        
    }, [ activeButtons, editorState])

    const handleKeyCommand = command => {
        const newState = RichUtils.handleKeyCommand(editorState, command)

        if(newState){
            onChange(newState)
            setActiveButtons([...activeButtons, command.toUpperCase()])

            return 'handled'
        }

        setActiveButtons(activeButtons.filter(activeButton => activeButton !== command))

        return 'not-handled'
    }

    const addLink = ({ src, target }) => {
        const selection = editorState.getSelection()

        if (!src) {
          onChange(RichUtils.toggleLink(editorState, selection, null));

          return "handled"
        }

        const content = editorState.getCurrentContent()
        const contentWithEntity = content.createEntity("LINK", "MUTABLE", { url: src, target })
        const newEditorState = EditorState.push(editorState, contentWithEntity, "create-entity")
        const entityKey = contentWithEntity.getLastCreatedEntityKey()

        onChange(RichUtils.toggleLink(newEditorState, selection, entityKey))

        return "handled"
    }

    const addMediaEntity = ({ media, file, src, font }) => {
        const contentState = editorState.getCurrentContent()
        let contentStateWithEntity = null

        const createContentStateWithEntity = () => {
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
            const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity }, 'create-entity')
    
            onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "))
        }

        if(file){
            const reader = new FileReader()

            reader.readAsDataURL(file)
            reader.onload = ({ target: { result } }) => {
                const key = `${Date.now()}-${file.name}`

                contentStateWithEntity = contentState.createEntity(media, 'IMMUTABLE', { file, src: result, font, key })

                createContentStateWithEntity()
            }
        }
        else {
            const key = Date.now()

            contentStateWithEntity = contentState.createEntity(media, 'IMMUTABLE', media === 'image' ? { file, src, font, key } : { src })

            createContentStateWithEntity()
        } 
    }

    const handleEntitiyButtons = ({ type, attrs }) => {
        switch(type){
            case 'LINK': return addLink(attrs)
            case 'IMAGE': return addMediaEntity({ media: 'image', ...attrs  })
            case 'VIDEO': return addMediaEntity({ media: 'video', ...attrs  })
            default: return
        }
    }

    const handleUIButtons = ({ type, style, color }, ...args) => event => {
        event.preventDefault()

        const [ attrs ] = args

        if(type) return handleEntitiyButtons({ type, attrs })

        const currentStyle = { [style]: editorState.getCurrentInlineStyle().has(style) }
        let currentEditorState = editorState

        if(currentStyle[style] && (style === 'TEXT-COLOR' || style === 'HIGHLIGHT') ){
            currentEditorState = RichUtils.toggleInlineStyle(editorState, style)
        }

        currentEditorState = RichUtils.toggleInlineStyle(currentEditorState, style)

        switch(style){
            case 'TEXT-COLOR': 
                setPlugins([createTextColorPlugin({ color }), plugins[1], createLinkPlugin()]) 
                break
            case 'HIGHLIGHT':  
                setPlugins([ plugins[0], createHighlightPlugin({ color }), createLinkPlugin() ])
                break
            default: setActiveButtons(currentStyle[style] ? activeButtons.filter(btn => btn !== style) : [...activeButtons, style])
        }

        onChange(currentEditorState)
    }

    const toggleBlockType = blockType => onChange(RichUtils.toggleBlockType(editorState, blockType))

    return (
        <div className="editor-container">
            <Suspense fallback={<div></div>}>
                <EditorOptions 
                    editorState={editorState}
                    activeButtons={activeButtons}
                    onClick={handleUIButtons}
                    onToggleFn={toggleBlockType}
                />
            </Suspense>
            <Editor 
                editorState={editorState} 
                plugins={plugins}
                onChange={onChange}
                handleKeyCommand={handleKeyCommand}
                blockRendererFn={entityBlockRenderer}
            />
        </div>
    )
}

export default TextEditor