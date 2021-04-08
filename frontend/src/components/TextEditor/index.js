import React, { Suspense, lazy, useState, useEffect } from 'react'
import Editor from 'draft-js-plugins-editor'

import { RichUtils, EditorState } from 'draft-js'
import { getBlockStyle } from './EditorOptions'
import { createTextColorPlugin, createHighlightPlugin, createLinkPlugin } from './plugins'

import './styles.css'

const EditorOptions = lazy(() => import('./EditorOptions'))

const TextEditor = ({ editorState, onChange }) => {
    const [ activeButtons, setActiveButtons ] = useState([])

    const [ plugins, setPlugins ] = useState([ 
        createTextColorPlugin({}), 
        createHighlightPlugin({}),
        createLinkPlugin()
    ])

    useEffect(() => setActiveButtons(activeButtons.filter(activeButton => editorState.getCurrentInlineStyle().has(activeButton))), [ editorState ])

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
            onChange(RichUtils.toggleLink(editorState, selection, null))
            
            return 'handled'
        }

        const content = editorState.getCurrentContent()
        const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: src, target })
        const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity')
        const entityKey = contentWithEntity.getLastCreatedEntityKey()

        onChange(RichUtils.toggleLink(newEditorState, selection, entityKey))
    }


    const handleEntitiyButtons = ({ type, attrs }) => {
        if(type === 'LINK') return addLink(attrs)
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
                setPlugins([createTextColorPlugin({ color }), plugins[1], createLinkPlugin() ]) 
                break
            case 'HIGHLIGHT':  
                setPlugins([ plugins[0], createHighlightPlugin({ color }), createLinkPlugin() ])
                break
            default: setActiveButtons(currentStyle[style] ? activeButtons.filter(btn => btn !== style) : [...activeButtons, style])
        }

        onChange(currentEditorState)
    }

    const toggleBlockType = blockType => {
        onChange(RichUtils.toggleBlockType(editorState, blockType))
    }

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
                blockStyleFn={getBlockStyle}
                handleKeyCommand={handleKeyCommand}
            />
        </div>
    )
}

export default TextEditor