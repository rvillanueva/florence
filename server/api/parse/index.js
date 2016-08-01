'use strict';

var express = require('express');
var controller = require('./parse.controller');

var router = express.Router();

router.get('/', controller.parse);

module.exports = router;
