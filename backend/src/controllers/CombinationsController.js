const db = require('../database/connection')
const filterByComponents = require('../utils/filterByComponents')

class CombinationsController {
    async create(request, response){
        const { name, graphic_card, processor, ram_memory, motherboard, fps_averages } = request.body

        const trx = await db.transaction()

        try{
            const [ id_combination ] = await trx('combinations').insert({ name, graphic_card, processor, ram_memory, motherboard })
    
            for(let index = 0; index < [...fps_averages].length; index++){
                const { fps_average, id_game } = fps_averages[index]

                await trx('fps_averages').insert({ fps_average, id_combination, id_game })
            }
    
            await trx.commit()
            
            return response.status(201).send()
        }
        catch(error){
            await trx.rollback()

            return response.status(400).send()
        }
    }
    async index(request, response){
        const joinWithFPS = async combinations => {  
            const FPSAverages = [... await db('fps_averages').select('*') ]
            const getFPSAverages = combination => FPSAverages.filter(FPSAverage => combination.id === FPSAverage.id_combination)
            
            return combinations.map(combination => ({...combination, FPSAverages: getFPSAverages(combination)}))
        }
        
        const { name,  ...components } = request.query
        const { id } = request.params

        let status = true, combinations = { graphic_card: [] , processor: [], ram_memory: [] }
    
        try{
            if(components && !name && !id){
                
                const filteredComponents = [...await filterByComponents(components)]

                filteredComponents.every(component => {
                    const [ key1, key2, key3 ] = Object.keys(component)

                    if(key1 === 'id'){
                        status = false

                        return status
                    }
                    
                    if(key1) combinations[key1] = [... new Set([...combinations[key1], component[key1]])]
                    if(key2) combinations[key2] = [... new Set([...combinations[key2], component[key2]])]
                    if(key3) combinations[key3] = [... new Set([...combinations[key3], component[key3]])]

                    return true
                })   
                
                if(!status) combinations = filteredComponents
            }
            else if(name){         
                combinations = await joinWithFPS(await db('combinations').select('*').where('name', 'like', `%${name === ' ' ? '' : name}%`))      
            }
            else if(id){
                combinations = await joinWithFPS(await db('combinations').select('*'). where('id', id))
            }
            else {                  
                combinations = await joinWithFPS([... await db('combinations').select('*')] )
            }           
        }
        catch(error){
            return response.status(400).json({ message: "Ocorreu um erro na listagem das combinações" })
        }

        return response.status(200).json(combinations)    
    }
    async update(request, response){
        const { id, name, graphic_card, processor, ram_memory, motherboard, fps_averages } = request.body
        
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

            await trx('combinations').where({ id }).update({ name, graphic_card, processor, ram_memory, motherboard })
            
            trx.commit()

            return response.status(200).json({ message: 'Foi' })
        }
        catch(error){
            trx.rollback()
            
            return response.status(400).json({ message: 'Ocorreu um erro na atualização dos dados da combinação. Por favor, tente novamente.' })
        }
    }
    async delete(request, response){
        const { id } = request.body
        
        try{
            await db('combinations').delete().where('id', id)

            console.log(await db('combinations').select('*'))
            return response.status(200).send()
        }
        catch(error){
            return response.json({ message: 'Ocorreu um erro na exclusão da combinação. Por favor, tente novamente.' })
        }
    }
}

module.exports = CombinationsController