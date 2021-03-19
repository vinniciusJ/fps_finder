const db = require('../database/connection')

class ComponentsController{
    async index(request, response){
        const combinations = [...await db('combinations').select('graphic_card', 'processor', 'ram_memory')]
        
        return response.status(200).json(combinations)
    }
}

module.exports = ComponentsController