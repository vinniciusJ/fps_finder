const db = require('../database/connection')

class CombinationsController {
    async create(request, response){
        const { name, graphic_card, processor, ram_memory, motherboard, fps_averages, components_links } = request.body
        const { graphic_card_link, processor_link, ram_memory_link, motherboard_link } = components_links

        const trx = await db.transaction()

        try{
            const [ id_combination ] = await trx('combinations').returning('id').insert({
                name, 
                graphic_card, 
                processor, 
                ram_memory, 
                motherboard,
                graphic_card_link,
                processor_link,
                ram_memory_link,
                motherboard_link
            })
    
            for(let { fps_average, id_game } of fps_averages){
                await trx('fps_averages').insert({ fps_average, id_combination, id_game })
            }
    
            await trx.commit()
            
            return response.status(201).send()
        }
        catch(error){
            console.error(error)

            await trx.rollback()

            return response.status(400).send()
        }

    }
    async index(request, response){
        const { ...components } = request.query, { id } = request.params

        const joinFPS = async ({ combination }) => ({
            ...combination,
            fps_averages:  await db('fps_averages').where('id_combination', combination.id).select('*')
        })

        console.log(components)

        try{
            if(Object.entries(components).length){
                const { graphic_card, processor, ram_memory } = components                                    
                
                const combination = await joinFPS({
                    combination: 
                        [...await db('combinations').where({ graphic_card }).where({ processor }).where({ ram_memory }) .select('*')][0]
                })

                return response.status(200).json(combination)
            }
            else if(id){
                const combination = await joinFPS({
                    combination: [...await db('combinations').select('*').where({ id })][0]
                })

                return response.status(200).json(combination)
            }
            else{
                const combinations = [...await db('combinations').select('*')], combinationsWithFPS = []
                
                for(let combination of combinations)
                    combinationsWithFPS.push(await joinFPS({ combination }))

                return response.status(200).json(combinationsWithFPS) 
            }
        }
        catch(error){
            console.error(error)

            return response.status(400).json({ message: "Ocorreu um erro na listagem das combinações" })
        }  
    }
     
    async update(request, response){
        const { id, name, graphic_card, processor, ram_memory, motherboard, fps_averages, components_links } = request.body
        const { graphic_card_link, processor_link, ram_memory_link, motherboard_link } = components_links
        
        const trx = await db.transaction()

        try{
            const previousFPSIds = [ ...await trx('fps_averages').select('id').where('id_combination', id) ].map(item => item.id)
            
            const currentFPSIds = fps_averages.map(item => item.id)

            previousFPSIds.forEach(async FPSId => 
                currentFPSIds.includes(FPSId) || await db('fps_averages').where('id', FPSId).delete()
            )

            fps_averages.forEach(async FPSAverageItem => {
                const { id: FPSId, fps_average, id_game } = FPSAverageItem
            
                if(FPSId) {
                    await trx('fps_averages').where({ id: FPSId }).update({ fps_average, id_game })
                }
                else {
                    await trx('fps_averages').insert({ fps_average, id_combination: id, id_game })
                }
            })

            await trx('combinations').where({ id }).update({
                name, 
                graphic_card, 
                processor, 
                ram_memory, 
                motherboard,
                graphic_card_link,
                processor_link,
                ram_memory_link,
                motherboard_link
            })
            
            trx.commit()

            return response.status(200).json({ message: 'Foi' })
        }
        catch(error){
            console.error(error)
            trx.rollback()
            
            return response.status(400).json({ message: 'Ocorreu um erro na atualização dos dados da combinação. Por favor, tente novamente.' })
        }
    }
    async delete(request, response){
        const { id } = request.body
        
        try{
            await db('combinations').delete().where('id', id)

            return response.status(200).send()
        }
        catch(error){
            console.error(error)

            return response.json({ message: 'Ocorreu um erro na exclusão da combinação. Por favor, tente novamente.' })
        }
    }
}

module.exports = CombinationsController