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


//Common error for unknown route

router.use('*',(req,res)=>{
    return res.status(404).send("not_found").json();
});

module.exports = router;