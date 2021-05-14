import React, { useEffect, useState } from 'react'
import { stateToHTML } from 'draft-js-export-html'

import styles from './styles.module.scss'

const PostContent = ({ content }) => {
    const [ HTMLContent, setHTMLContent ] = useState({})
    const [ isMobileDevice, setIsMobileDevice ] = useState(true)

    useEffect(() => {
        if(!content) return

        const entityStyleFn = entity => {
            const type = entity.getType().toLowerCase()
    
            if(type === 'link'){
                const data = entity.getData()
    
                return {
                    element: 'a',
                    attributes: {
                        href: data.url,
                        target: data.target,
                        rel: "noopener noreferrer",
                        "aria-label": data.url
                    }
                }
            }
    
            return null
        }
    
        const inlineStyleFn = styles => {
            let colorKey = 'COLOR', highlightKey = 'HIGHLIGHT'
    
            const color = styles.filter(value => value.startsWith(colorKey)).first()
            const highlight = styles.filter(value => value.startsWith(highlightKey)).first()

            if(color) {
                return ({
                    element: 'span',
                    style: {
                        color: color.replace(colorKey, '')
                    }
                })
            }
    
            if(highlight) {
                const bgColor = highlight.replace(highlightKey, ' ')
                const colorStyle = ['#5500F1', ' #9776FF'].includes(bgColor) ? '#FFF' : '#000'

                return ({
                    element: 'span',
                    style: {
                        color: colorStyle,
                        background: bgColor
                    }
                })
            }
        }
    
        const renderTitlesBlock = block => {
            const isAtitle = ['header-one', 'header-two', 'header-three'].includes(block.getType().toLowerCase())
    
            if(isAtitle) return ({
                attributes: {
                    class: styles.title
                }
            })
    
            return null
        }
    
        const renderAtomicBlock = block => {
            const entity = block.getData()
            const type = entity.get('type')
    
            if(type === 'image'){
                const src = entity.get('src')
                const font = entity.get('font')
    
                return (`
                    <figure>
                        <img src=${src} alt=${font} />
                        <figcaption><strong>Fonte: </strong>${font}</figcaption>
                    </figure>
                `)
            }
    
            if(type === 'video'){
                const src = entity.get('src')
               
                return (`
                    <div className=${styles.iframeWrapper}>
                        <iframe width=${isMobileDevice ? '100%' : '100%'} height=${isMobileDevice ? 280 : 548  } src=${src} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>Oi</iframe>
                    </div>
                `)
            }
    
            return null
        }
    
        const renderListItemBlock = block => {
            if(['unordered-list-item', 'ordered-list-item'].includes(block.getType().toLowerCase())){
                const text = block.getText()
    
                return (
                    `<li>${text.trimStart()}</li>`
                )
            }
            
            return null
        }

        const conversationOptions = {
            entityStyleFn,
            blockRenderers: {
                atomic: renderAtomicBlock,
                'unordered-list-item': renderListItemBlock,
                'ordered-list-item': renderListItemBlock
            },
            blockStyleFn: renderTitlesBlock,
            inlineStyleFn
        }

        const convertedContent = stateToHTML(content, conversationOptions)

        setHTMLContent(convertedContent)

    }, [ content, isMobileDevice ])

    useEffect(() => setIsMobileDevice(window.matchMedia('(max-width: 768px)').matches), [ ])

    return (
        <article className={styles.postContent} dangerouslySetInnerHTML={{ __html: HTMLContent ?? "<div></div>" }}/>
    )
}

export default PostContent