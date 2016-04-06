'use strict';

var express = require('express');
var controller = require('./conversation.controller');

var router = express.Router();

router.get('/start', controller.start);

module.exports = router;
