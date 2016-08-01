'use strict';

var express = require('express');
var controller = require('./task.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/instruction', controller.getFromInstruction);

module.exports = router;
