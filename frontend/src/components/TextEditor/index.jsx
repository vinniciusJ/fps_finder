import Editor from 'draft-js-plugins-editor'

import { Suspense, lazy, useState, useEffect } from 'react'
import { RichUtils, EditorState, AtomicBlockUtils } from 'draft-js'
import { createTextColorPlugin, createHighlightPlugin, createLinkPlugin } from './plugins'
import { entityBlockRenderer } from './Entities/mediaBlockRenderer'
import { createSearcher } from '../../utils/'

import './styles.css'

const EditorOptions = lazy(() => import('./EditorOptions'))

const TextEditor = ({ editorState, onChange }) => {
    const [ activeButtons, setActiveButtons ] = useState([])

    const plugins = [
        createTextColorPlugin(), 
        createHighlightPlugin(),
        createLinkPlugin()
    ]

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
            case 'LINK': 
                return addLink(attrs)
            case 'IMAGE': 
                return addMediaEntity({ media: 'image', ...attrs  })
            case 'VIDEO': 
                return addMediaEntity({ media: 'video', ...attrs  })
            default: 
                return
        }
    }

    const handleUIButtons = ({ type, style }, ...args) => event => {
        event.preventDefault()

        const [ attrs ] = args

        if(type) return handleEntitiyButtons({ type, attrs })

        const hasStyle = editorState.getCurrentInlineStyle().has(style)

        let currentEditorState = editorState

        const colorSearcher = createSearcher({ value: 'COLOR' })
        const highlightSearcher = createSearcher({ value: 'HIGHLIGHT' })

        const isComplexInlineStyle = (style.match(colorSearcher) || style.match(highlightSearcher))

        if(isComplexInlineStyle){
            const [ colors, highlights ] = [
                [ '#000000', '#737373', '#E7E6E6', '#5500F1', '#9776FF', '#FFD382'],
                ['#FFFFFF', '#5500F1', '#9776FF', '#FFD382']
            ]

            const toggleInlineStyles = ({ type, options }) => {
                const styles = []

                options.forEach(opt => {
                    editorState.getCurrentInlineStyle().has(`${type}${opt}`) && styles.push(`${type}${opt}`)
                })

                styles.forEach(inlineStyle => currentEditorState = RichUtils.toggleInlineStyle(editorState, inlineStyle))
            }

            if(style.match(colorSearcher)){
                toggleInlineStyles({ type: 'COLOR', options: colors })
            }

            if(style.match(highlightSearcher)){
                toggleInlineStyles({ type: 'HIGHLIGHT', options: highlights })
            }
        }

        currentEditorState = RichUtils.toggleInlineStyle(currentEditorState, style)

        onChange(currentEditorState)
        setActiveButtons(hasStyle ? activeButtons.filter(btn => btn !== style) : [...activeButtons, style])
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