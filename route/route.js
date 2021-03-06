const express = require('express');

const router = express.Router();

const casino = require('./casino.route');

const game = require('./game.route');

const user = require('../route/user.route');

//Casino Related APIs

router.use('/api/v1/casinos',casino);

//Game Related APIs 

router.use('/api/v1/games',game);


//User Related APIs

router.use('/api/v1/users',user);

module.exports = router;