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

            const [ createdCombination ] = await trx('combinations').select('*').where('combinations.id', id_combination)
            const createdCombinationFPSs = await trx('fps_averages').select('*').where('id_combination', id_combination)

            await trx.commit()

            return response.status(201).json({ ...createdCombination, fpsAverages: [ ...createdCombinationFPSs ] })
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

        const { components, name } = request.body
        
        let filteredCombinations = []
        let combinationsCounter

        try{
            if(components){
                filteredCombinations = await filterByComponents(components)
            }
            else if(name){
                const combinations = await db('combinations').select('*').where('name', 'like', `%${name}%`)
                
                filteredCombinations = await joinWithFPS(combinations)
            }
            else {
                const combinations = [... await db('combinations').select('*')] 
                
                combinationsCounter = combinations.length
                filteredCombinations = await joinWithFPS(combinations)
            }           
        }
        catch{
            return response.status(400).json({ message: "Ocorreu um erro na listagem das combinações" })
        }

        return response.status(200).json(combinationsCounter ? { filteredCombinations, combinationsCounter } : filteredCombinations)
    }
    async update(request, response){
        const { id, name, graphic_card, processor, ram_memory, motherboard, FPSAverages } = request.body

        const trx = await db.transaction()

        try{
            FPSAverages.forEach(async FPSAverageItem => 
                await trx('fps_averages').where('id', FPSAverageItem.id).update('fps_average', FPSAverageItem.fps_average)
            )

            await trx('combinations').where({ id }).update({ id, name, graphic_card, processor, ram_memory, motherboard })
            
            trx.commit()

            return response.status(200).json({ })
        }
        catch{
            trx.rollback()

            return response.status(400).json({ message: 'Ocorreu um erro na atualização dos dados da combinação. Por favor, tente novamente.' })
        }
    }
    async delete(request, response){
        const { id } = request.body

        try{
            const deletedCombination = await db('combinations').where('id', id).delete()

            return response.status(200).json({ deletedCombination })
        }
        catch{
            return response.status(400).json({ message: 'Ocorreu um erro na exclusão da combinação. Por favor, tente novamente.' })
        }
    }
}

module.exports = CombinationsController