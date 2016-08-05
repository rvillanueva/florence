'use strict';

var express = require('express');
var controller = require('./instruction.controller');

var router = express.Router();

router.get('/', controller.query);
router.post('/notify', controller.notify);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.post('/:id/queue', controller.queue);

module.exports = router;
