/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var List = require('../api/list/list.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com', 
    password: 'admin'
  }, 
  function(err, userTest, userAdmin) {
      console.log('finished populating users');
      List.find({}).remove(function(){
        List.create({
          user: userTest,
          title: "animals",
          items: [{
            label:"aardvark", 
            lookupProvider:"omegawiki",
            uri: "http://www.omegawiki.org/DefinedMeaning:1031502"
          }, {
            label:"bear", 
          }, {
            label: "cat", 
          }, { 
            label: "dog",
          }]
        }, {
          user: userAdmin,
          title: "books",
          items: [{
            label: "Art in Theory",
          }, { 
            label: "Begin Chess",
          }, { 
            label: "Collins German Dictionary",
          }, { 
            label: "Dance, Dance, Dance"
          }]
        }, {
          user: userAdmin,
          title: "wordnets",
          items: [{
            label: "Multi Wordnet",
          }, { 
            label: "Open Multilingual Wordnet",
          }, { 
            label: "Princton Wordnet of English",
          }, { 
            label: "Mimida Multilingual Semantic Network"
          }]
        }, 
        function (err) {
          console.log('finished populating lists');
        });
      });
    }
  );
});