/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Aspect from '../api/aspect/aspect.model';

Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    });
  });

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('Users populated.');
    });
  });

  Aspect.find({}).remove()
    .then(() => {
      Aspect.create({
        key: 'mood',
        name: 'mood',
        type: 'outcome',
        scale: {
          min: 1,
          max: 10
        },
        questions: {
          score: ['On a scale of 1 to 10, how do you feel right now?'],
          trigger: ['What sort of things are making you feel better or worse?']
        }
      },
      {
        key: 'anxiety',
        name: 'anxiety',
        type: 'outcome',
        scale: {
          min: 1,
          max: 10
        },
        questions: {
          score: ['On a scale of 1 to 10, how do is your anxiety right now?'],
          trigger: ['What sort of things are making you more or less anxious?']
        }
      })
      .then(() => {
        console.log('Aspects populated.');
      });
    });
