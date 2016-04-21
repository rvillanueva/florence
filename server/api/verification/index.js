'use strict';

var express = require('express');
var controller = require('./verification.controller');

var router = express.Router();

router.get('/', controller.verify);

module.exports = router;
