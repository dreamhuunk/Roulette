const user = require('../controller/user.controller');

const express = require('express');

const router = express.Router();

router.post('/',user.registerUser);
router.post('/:id(\\d+)/casinos/:casino_id(\\d+)/bets',user.betOnGame);

//Adding additional API to get the list of casinos


router.put('/:id(\\d+)/balance',user.rechargeBalance);
router.put('/:id(\\d+)/casinos/:casino_id(\\d+)',user.enterCasino);


router.get('/:id(\\d+)/casinos/:casino_id(\\d+)/games',user.getGamesList);

module.exports = router;