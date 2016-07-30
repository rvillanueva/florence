'use strict';

var express = require('express');
var controller = require('./instruction.controller');

var router = express.Router();

router.get('/', controller.query);
router.post('/notify', controller.notify);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;
