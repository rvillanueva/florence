/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/parse', require('./api/parse'));
  app.use('/api/instructions', require('./api/instruction'));
  app.use('/api/messages', require('./api/message'));
  app.use('/api/questions', require('./api/question'));
  app.use('/api/sms', require('./api/sms'));
  app.use('/api/tasks', require('./api/task'));
  app.use('/api/programs', require('./api/program'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
