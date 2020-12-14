const setOtherComponents = require('./setOthercomponents')
const db = require('../database/connection')

const filterByComponents = async components => {
    const getComponentKeys  = component => Object.keys(component)

    const componentsLength = Object.keys(components).length

    if(componentsLength === 3){
        const [ key1, key2, key3 ] = getComponentKeys(components)
        
        const [ combination ] = await db('combinations')
                                        .where(key1, components[key1])
                                        .where(key2, components[key2])
                                        .where(key3, components[key3])
                                        .select('*')
        
        const combinationFPSs = await db('fps_averages').select('*').where('id_combination', combination.id)
                                        

        return ({ ...combination, FPSAverages: [...combinationFPSs] })
    }
    else if(componentsLength === 2){
        const [ key1, key2 ] = getComponentKeys(components)
        const [ key3 ] = setOtherComponents([key1])

        const filteredComponents = await db('combinations')
                                            .select(key3)
                                            .where(key1, components[key1])
                                            .where(key2, components[key2])

        return filteredComponents
    }
    else if(componentsLength === 1){
        const [ key1 ] = getComponentKeys(components)
        const [ key2, key3 ] = setOtherComponents([key1])

        const filteredComponents = await db('combinations')
                                            .select(`${key2}`, `${key3}`)
                                            .where(key1, components[key1])
        
        return filteredComponents  
    }
}

module.exports = filterByComponents