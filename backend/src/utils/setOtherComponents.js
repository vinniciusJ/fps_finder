const setOtherComponents = (componentKeys) => {
    if(componentKeys.length == 1){
        const [ componentKey ] = componentKeys
        
        if(componentKey === 'graphic_card'){
            return ['processor', 'ram_memory' ]
        }
        else if (componentKey === 'processor'){
            return ['graphic_card', 'ram_memory']
        }
        else {
            return ['graphic_card', 'processor']
        }
    }
    else {
        const [ componentKey1, componentKey2 ] = componentKeys
        
        if(componentKey1 === 'graphic_card'){
            return componentKey2 === 'processor' ? ['ram_memory'] : ['processor']
        }
        else if (componentKey1 === 'processor'){
            return componentKey2 === 'graphic_card' ? ['ram_memory'] : ['graphic_card']
        }
        else {
            return componentKey2 === 'processor' ? ['graphic_card'] : ['processor']
        }
    }
}

module.exports = setOtherComponents