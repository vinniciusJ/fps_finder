import React, { Suspense, lazy, useState, useEffect } from 'react'
import Editor from 'draft-js-plugins-editor'
import createTextColorPlugin from './plugins/textColorPlugin'

import { RichUtils } from 'draft-js'
import { getBlockStyle } from './EditorOptions'

import './styles.css'

const EditorOptions = lazy(() => import('./EditorOptions'))


const TextEditor = ({ editorState, onChange }) => {
    const [ activeButtons, setActiveButtons ] = useState([])
    const [ plugins, setPlugins ] = useState([ createTextColorPlugin({}) ])

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

    const handleUIButtons = ({ style }) => event => {
        event.preventDefault()

        const currentStyle = { [style]: editorState.getCurrentInlineStyle().has(style) }

        onChange(RichUtils.toggleInlineStyle(editorState, style))
        
        if(style !== 'TEXT-COLOR'){
            setActiveButtons(currentStyle[style] ? activeButtons.filter(btn => btn !== style) : [...activeButtons, style])

            return
        }
        
        setPlugins([createTextColorPlugin({ color: '#c08F90' })])
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
                    onChange={onChange}
                    onToggle={toggleBlockType}
                />
            </Suspense>
            <Editor 
                editorState={editorState} 
                plugins={plugins}
                onChange={onChange}
                handleKeyCommand={handleKeyCommand}
            />
        </div>
    )
}

export default TextEditor