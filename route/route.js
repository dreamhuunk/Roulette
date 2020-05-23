const express = require('express');

const router = express.Router();

const casino = require('./casino.route');

//Casino Related APIs

router.use('/api/v1/casinos',casino);

module.exports = router;