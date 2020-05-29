const casino = require("../controller/casino.controller");

const express = require('express');

const router = express.Router();

const schemas = require('../utils/schemas');

const RequestValidator = require('../middleware/schema_validator');

const commonSchema = schemas.common;


router.get('/:id(\\d+)/dealers',casino.listDealers);

router.post('/',casino.registerCasino);
router.post('/:id(\\d+)/dealers', casino.addDealer);

router.put('/:id(\\d+)/balance',RequestValidator.schemaValidator(commonSchema.amountValidator),casino.rechargeBalance);

module.exports = router;