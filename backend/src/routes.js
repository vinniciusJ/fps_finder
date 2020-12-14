const express = require('express')

const GamesController = require('./controllers/GamesController')
const CombinationsController = require('./controllers/CombinationsController')

const router = express.Router()

const gamesController = new GamesController()
const combinationsController = new CombinationsController()

router.route('/games')
    .post(gamesController.create)
    .put(gamesController.update)
    .get(gamesController.index)

router.route('/combinations')
    .post(combinationsController.create)
    .get(combinationsController.index)
    .delete(combinationsController.delete)


module.exports = router