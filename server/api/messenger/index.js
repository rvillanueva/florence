'use strict';

var express = require('express');
var controller = require('./messenger.controller');

var router = express.Router();

router.post('/webhook', controller.webhook);

module.exports = router;
