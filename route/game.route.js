const game = require('../controller/game.controller');

const express = require('express');


const router = express.Router();

router.post('/', game.createGame);

//All game related Action would be done using the API

router.put('/:id(\\d+)', game.updateGame);

module.exports = router;