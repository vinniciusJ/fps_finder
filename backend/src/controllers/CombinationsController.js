const db = require('../database/connection')

class CombinationsController {
    async create(request, response){
        const {
            name,
            graphic_card,
            processor,
            ram_memory,
            motherboard,
            fps_averages
        } = request.body

        const trx = await db.transaction()

        try {
            const [ id_combination ] = await trx('combinations').insert({ name, graphic_card, processor, ram_memory, motherboard })

            fps_averages.forEach(async fps_average_item => {
                const { fps_average, id_game } = fps_average_item

                await trx('fps_averages').insert({ fps_average, id_combination, id_game })
            })

            const [createdCombination] = await trx('combinations').select('*').where('combinations.id', id_combination)
            const createdCombinationFPSs = await trx('fps_averages').select('*').where('id_combination', id_combination)


            await trx.commit()

            return response.status(201).json({ ...createdCombination, fps_averages: { ...createdCombinationFPSs } })
        }
        catch(err) {
            await trx.rollback()

            console.log(err)

            return response.status(400).json('Unexpected error while creating a combination')
        }
    }
}

module.exports = CombinationsController