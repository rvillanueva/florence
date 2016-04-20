'use strict';

var express = require('express');
var controller = require('./entry.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/user/me', auth.isAuthenticated(), controller.showMyEntries);
router.get('/user/:userId', auth.hasRole('admin'), controller.showUserEntries);

/*router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);*/

module.exports = router;
