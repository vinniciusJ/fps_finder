const express = require('express')

const GamesController = require('./controllers/GamesController')

const router = express.Router()

const gameController = new GamesController()

router.route('/games')
.post(gameController.create)
.put(gameController.update)
.get(gameController.index)


module.exports = router