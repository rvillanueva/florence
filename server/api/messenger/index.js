'use strict';

var express = require('express');
var controller = require('./messenger.controller');

var router = express.Router();

router.get('/', controller.webhook);
router.post('/', controller.receive);

module.exports = router;
