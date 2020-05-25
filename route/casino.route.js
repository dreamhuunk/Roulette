const casino = require("../controller/casino.controller");

const express = require('express');

const router = express.Router();


router.get('/:id(\\d+)/dealers',casino.listDealers);

router.post('/',casino.registerCasino);
router.post('/:id(\\d+)/dealers', casino.addDealer);

router.put('/:id(\\d+)/balance',casino.rechargeBalance);

module.exports = router;