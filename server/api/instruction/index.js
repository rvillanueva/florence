'use strict';

var express = require('express');
var controller = require('./instruction.controller');

var router = express.Router();

router.get('/', controller.query);

module.exports = router;
