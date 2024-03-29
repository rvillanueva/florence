'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/register', controller.signup);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/identity', auth.isAuthenticated(), controller.updateIdentity);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', controller.create);
router.post('/:id/notify', auth.isAuthenticated(), controller.notify);
router.get('/:id/entries', auth.isAuthenticated(), controller.entries);

module.exports = router;
