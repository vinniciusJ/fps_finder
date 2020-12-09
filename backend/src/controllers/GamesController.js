const db = require('../database/connection')

const isAnURL = require('../utils/isAnURL')

class GamesController{
    async create(request, response){
        const { name, url_logo } = request.body

        if(!name || !url_logo){
            return response.status(422).json({ error: `It's missing arguments` })
        }
        else if(!isAnURL(url_logo)){
            return response.status(400).json({ error: 'URL invalid format' })
        }
        
        try{
            await db('games').insert({ name, url_logo })
        }
        catch(error){
            return response.status(400).json('Unexpected error while creating a game')
        }

        return response.status(201).json({ name, url_logo })
    }
    async index(request, response){
        const { filterOption  } = request.body
        let games = []

        try{
            if(filterOption){
                games = await db('games').select('*').where('name', 'like', `%${filterOption}%`)
            }
            else {
                games = await db('games').select('*')
            }
        }
        catch{
            return response.status(400).json('Unexpected error while listing the games')
        }
        
        return response.status(200).json(games)
    }
    async update(request, response){
        const { id, name, url_logo } = request.body

        if(!name && !url_logo) return response.status(422).json({ error: 'You must pass at least one argument' })

        try{
            if(!name){
                await db('games').where('id', id).update({ url_logo })
            }
            else if(!url_logo){
                await db('games').where('id', id).update({ name })
            }
            else {
                await db('games').where('id', id).update({ name, url_logo })
            }
        }
        catch(error){
            return response.status(400).json('Unexpected error while updating a game')
        }

        const [ updatedGame ] = await db('games').select('*').where('id', id)

        return response.status(200).json({ ...updatedGame })
    }
}

module.exports = GamesController