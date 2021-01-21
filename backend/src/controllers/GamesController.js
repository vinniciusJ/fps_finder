const db = require('../database/connection')

const isAnURL = require('../utils/isAnURL')

class GamesController{
    async create(request, response){
        const { name, url_logo } = request.body

        if(!name || !url_logo){
            return response.status(422).json({ message: 'Você deve informar um nome e a URL da logo do jogo.' })
        }
        else if(!isAnURL(url_logo)){
            return response.status(400).json({ message: 'Formato inválido de URL.' })
        }
        
        try{
            await db('games').insert({ name, url_logo })
        }
        catch(error){
            return response.status(400).json({ message: 'Ocorreu um erro na criação de um game.' })
        }

        return response.status(201).json({ name, url_logo })
    }
    async index(request, response){
        try{
            const games = [...await db('games').select('*')]

            return response.status(200).json(games)
        }
        catch{
            return response.status(400).json({ message: 'Ocorreu um erro na listagem de games' })
        }
    }
    async update(request, response){
        const { id, name, url_logo } = request.body

        if(!name && !url_logo) return response.status(422).json({ message: 'Você deve passar pelo menos uma opção para editar' })

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
            return response.status(400).json({ message: 'Ocorreu um erro na atualização dos dados do jogo' })
        }

        const [ updatedGame ] = await db('games').select('*').where('id', id)

        return response.status(200).json(updatedGame)
    }
}

module.exports = GamesController