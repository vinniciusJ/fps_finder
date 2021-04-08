import React, { Suspense, lazy, useState, useEffect } from 'react'
import Editor from 'draft-js-plugins-editor'


import { RichUtils } from 'draft-js'
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

    const handleEntitiyButtons = ({ type, ...args }) => {
        console.log(type)
    }

    const handleUIButtons = ({ type, style, color }) => event => {
        event.preventDefault()

        //if(type) return handleEntitiyButtons({ type })

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