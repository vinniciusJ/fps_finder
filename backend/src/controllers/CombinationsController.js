const { join } = require('../database/connection')
const db = require('../database/connection')
const filterByComponents = require('../utils/filterByComponents')

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

            //const [ createdCombination ] = 
            //const createdCombinationFPSs = 

            await trx('combinations').select('*').where('combinations.id', id_combination)
            await trx('fps_averages').select('*').where('id_combination', id_combination)

            await trx.commit()

            return response.status(201).send()
        }
        catch{
            await trx.rollback()

            return response.status(400).json({ message: 'Aconteceu um erro na criação de uma combinação. Por favor, tente novamente.' })
        }
    }
    async index(request, response){
        const joinWithFPS = async combinations => {
            const getFPSAverages = combination => FPSAverages.filter(FPSAverage => combination.id === FPSAverage.id_combination)
            const FPSAverages = [... await db('fps_averages').select('*') ]

            return combinations.map(combination => ({...combination, FPSAverages: getFPSAverages(combination)}))
        }

        let { components, name, id } = request.query

        let combinations = { 'graphic_card': [] , 'processor': [], 'ram_memory': [] }
        let status = true

        if(components) components = JSON.parse(components)

        try{
            if(components){
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
                combinations = await joinWithFPS(await db('combinations').select('*').where('name', 'like', `%${name}%`))
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
            fps_averages.forEach(async FPSAverageItem => {
                const { id, fps_average } = FPSAverageItem

                console.log(FPSAverageItem)
            
                await trx('fps_averages').where({ id }).update({ fps_average })
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
            await db('combinations').select('id').where('id', id).delete()

            return response.status(200).send()
        }
        catch(error){
            return response.json({ message: 'Ocorreu um erro na exclusão da combinação. Por favor, tente novamente.' })
        }
    }
}

module.exports = CombinationsController