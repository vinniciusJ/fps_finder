import React, { Suspense, lazy } from 'react'

const Image = lazy(() => import('./Image'))
const Video = lazy(() => import('./Video'))

const Entity = props => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0))
    const type = entity.getType()

    let { file, src, font } = entity.getData()

    if(type === 'image'){
        return (
            <Suspense fallback={<div></div>}>
                <Image file={file} src={src} font={font}/>
            </Suspense>
        )
    }

    if(type === 'video'){
        return (
            <Suspense fallback={<div></div>}>
                <Video src={src} />
            </Suspense>
        )
    }

    return null
}

export const entityBlockRenderer = block => {
    if(block.getType() === 'atomic'){
        return { component: Entity, editable: false }
    }

    return null
}