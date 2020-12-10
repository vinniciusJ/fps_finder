const db = require('../database/connection')

class CombinationsController {
    async create(request, response){
        const { name, graphic_card, processor, ram_memory, motherboard, fps_averages } = request.body

        const trx = await db.transaction()

        try {
            const [ id_combination ] = await trx('combinations').insert({ name, graphic_card, processor, ram_memory, motherboard })

            fps_averages.forEach(async fps_average_item => {
                const { fps_average, id_game } = fps_average_item

                await trx('fps_averages').insert({ fps_average, id_combination, id_game })
            })

            const [ createdCombination ] = await trx('combinations').select('*').where('combinations.id', id_combination)
            const createdCombinationFPSs = await trx('fps_averages').select('*').where('id_combination', id_combination)

            await trx.commit()

            return response.status(201).json({ ...createdCombination, fps_averages: [ ...createdCombinationFPSs ] })
        }
        catch{
            await trx.rollback()

            return response.status(400).json('Unexpected error while creating a combination')
        }
    }
    async index(request, response){
        const setOtherAttrs = (attrsParams) => {
            if(attrsParams.length == 1){
                const [ attr ] = attrsParams
                
                if(attr.name === 'graphic_card'){
                    return ['processor', 'ram_memory' ]
                }
                else if (attr.name === 'processor'){
                    return ['graphic_card', 'ram_memory']
                }
                else {
                    return ['graphic_card', 'processor']
                }
            }
            else {
                const [ attr1, attr2 ] = attrsParams
                
                if(attr1.name === 'graphic_card'){
                    return attr2.name === 'processor' ? ['ram_memory'] : ['processor']
                }
                else if (attr1.name === 'processor'){
                    return attr2.name === 'graphic_card' ? ['ram_memory'] : ['graphic_card']
                }
                else {
                    return attr2.name === 'processor' ? ['graphic_card'] : ['processor']
                }
            }
        }

        const { attrs } = request.body

        try{
            if(attrs.length === 3){
                const [ attr1, attr2, attr3 ] = attrs
                    
                const [ combination ] = await db('combinations')
                                                .where(attr1.name, attr1.value)
                                                .where(attr2.name, attr2.value)
                                                .where(attr3.name, attr3.value)
                                                .select('*')
                
                const combinationFPSs = await db('fps_averages').select('*').where('id_combination', combination.id)
                                                

                return response.status(200).json({ ...combination, fps_averages: [...combinationFPSs] })
            }
            else if(attrs.length === 2){
                const [ attr1, attr2 ] = attrs
                const [ attr3 ] = setOtherAttrs([attr1, attr2])
                
                const filteredComponents = await db('combinations')
                                                    .select(attr3)
                                                    .where(attr1.name, attr1.value)
                                                    .where(attr2.name, attr2.value)

                return response.status(200).json(filteredComponents)
            }
            else if(attrs.length === 1){
                const [ attr1 ] = attrs
                const [ attr2, attr3 ] = setOtherAttrs([attr1])

                const filteredComponents = await db('combinations')
                                                    .select(`${attr2}`, `${attr3}`)
                                                    .where(attr1.name, attr1.value)

                return response.status(200).json(filteredComponents)
            }
            else {
                return response.status(400).json({ error: 'You must pass at least one argument' })
            }
            
        }
        catch(error){

            console.log(error)
            return response.status(400).json('Unexpected error while listing a combination')
        }
    }
}

module.exports = CombinationsController