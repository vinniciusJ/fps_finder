import { useEffect, useState } from 'react'
import { stateToHTML } from 'draft-js-export-html'

import styles from './styles.module.scss'

const PostContent = ({ content }) => {
    const [ HTMLContent, setHTMLContent ] = useState({})
    
    const entityStyleFn = entity => {
        const type = entity.getType().toLowerCase()

        if(type === 'video') {
            const data = entity.getData()

            return {
                element: 'iframe',
                attributes: {
                    width: 560, 
                    height: 316,
                    src: data.src,
                    title: "YouTube video player",
                    frameBorder: 0,
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                    allowFullScreen: true
                }
            }
        }

        if(type === 'link'){
            const data = entity.getData()

            return {
                element: 'a',
                attributes: {
                    href: data.url,
                    target: data.target,
                    rel: "noopener noreferrer",
                    "aria-label": data.url
                },
                
            }
        }

        return null
    }

    const renderAtomicBlock = block => {
        const entity = block.getData()

        if(entity.get('type') === 'image'){
            const src = entity.get('src')
            const font = entity.get('font')

            return (`
                <figure>
                    <img src=${src} alt=${font} />
                    <figcaption><strong>Fonte: </strong>${font}</figcaption>
                </figure>
            `)
        }

        return null
    }

    const renderListItemBlock = block => {
        if(['unordered-list-item', 'ordered-list-item'].includes(block.getType().toLowerCase())){
            const text = block.getText()

            console.log(text)

            return (
                `<li>${text.trimStart()}</li>`
            )
        }
        
        return null
    }

    useEffect(() => {
        if(!content) return

        const convertedContent = stateToHTML(content, { 
            entityStyleFn, 
            blockRenderers: {
                atomic: renderAtomicBlock,
                'unordered-list-item': renderListItemBlock,
                'ordered-list-item': renderListItemBlock
            },
            inlineStyles: {
                HIGHLIGHT: {
                    style: { background: '#FFD382' }
                }
            },
            
        })

        setHTMLContent(convertedContent)

    }, [ content ])

    return (
        <article className={styles.postContent} dangerouslySetInnerHTML={{ __html: HTMLContent ?? "<div></div>" }}/>
    )
}

export default PostContent