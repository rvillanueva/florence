/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/outcomes', require('./api/outcome'));
  app.use('/api/behaviors', require('./api/behavior'));
  app.use('/api/belief', require('./api/belief'));
  app.use('/api/values', require('./api/value'));
  app.use('/api/messages', require('./api/message'));
  app.use('/api/messenger', require('./api/messenger'));
  app.use('/api/measures', require('./api/measure'));
  app.use('/api/entries', require('./api/entry'));
  app.use('/api/things', require('./api/thing'));
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
