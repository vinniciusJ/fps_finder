import React, { Suspense, lazy } from 'react'

const Image = lazy(() => import('./Image'))
const Video = lazy(() => import('./Video'))

const Entity = props => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0))

    const { src, font } = entity.getData()
    const type = entity.getType()

    if(type === 'image'){
        return (
            <Suspense fallback={<div></div>}>
                <Image src={src} font={font}/>
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