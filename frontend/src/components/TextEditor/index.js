import React, { Suspense, lazy, useState, useEffect } from 'react'
import Editor from 'draft-js-plugins-editor'
import { createTextColorPlugin, createHighlightPlugin } from './plugins'

import { convertToRaw, RichUtils } from 'draft-js'
import { getBlockStyle } from './EditorOptions'

import './styles.css'

const EditorOptions = lazy(() => import('./EditorOptions'))


const TextEditor = ({ editorState, onChange }) => {
    const [ activeButtons, setActiveButtons ] = useState([])

    const [ plugins, setPlugins ] = useState([ 
        createTextColorPlugin({}), 
        createHighlightPlugin({}) 
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

    const handleUIButtons = ({ style, color }) => event => {
        event.preventDefault()

        const currentStyle = { [style]: editorState.getCurrentInlineStyle().has(style) }
        let currentEditorState = editorState

        if(currentStyle[style]){
            currentEditorState = RichUtils.toggleInlineStyle(editorState, style)
        }

        currentEditorState = RichUtils.toggleInlineStyle(currentEditorState, style)

        switch(style){
            case 'TEXT-COLOR': 
                setPlugins([createTextColorPlugin({ color }), plugins[1]]) 
                break
            case 'HIGHLIGHT':  
                setPlugins([ plugins[0], createHighlightPlugin({ color }) ])
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
            {console.log(plugins
                )}
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