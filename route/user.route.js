const user = require('../controller/user.controller');

const express = require('express');

const schemas = require('../utils/schemas');

const RequestValidator = require('../middleware/schema_validator');

const commonSchema = schemas.common;

const router = express.Router();

router.post('/',user.registerUser);
router.post('/:id(\\d+)/casinos/:casino_id(\\d+)/bets',RequestValidator.schemaValidator(commonSchema.betValidator),user.betOnGame);
router.post('/:id(\\d+)/cashout',user.cashOutFromCasino);

//Adding additional API to get the list of casinos


router.put('/:id(\\d+)/balance',RequestValidator.schemaValidator(commonSchema.amountValidator),user.rechargeBalance);
router.put('/:id(\\d+)/casinos/:casino_id(\\d+)',user.enterCasino);


router.get('/:id(\\d+)/casinos/:casino_id(\\d+)/games',user.getGamesList);

module.exports = router;