const express = require('express')
const db = require('../database/connection')

const isAnURL = require('../utils/isAnURL')

class GamesController{
    async create(request, response){
        const { name, urlLogo } = request.body

        if(!name || !urlLogo){
            return response.status(200).json({ error: 'Missing parms' })
        }
        else if(!isAnURL(urlLogo)){
            return response.status(400).json({ error: 'URL invalid format' })
        }
        
        try{
            await db('games').insert({ name, urlLogo })
        }
        catch(error){
            return response.status(400).json('Unexpected error while creating a game')
        }

        return response.status(200).json({ name, urlLogo })
    }
    async index(request, response){
        const games = await db('games').select('*')
        
        return response.status(200).json(games)
    }
}

module.exports = GamesController