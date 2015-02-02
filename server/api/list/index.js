'use strict';

var express = require('express');
var controller = require('./list.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

/**
 * Using RESTful conventions for endpoints.
 * GET     /              ->  index
 * POST    /              ->  create
 * GET     /:id          ->  show
 * PUT     /:id          ->  update
 * DELETE  /:id          ->  destroy

 * GET      /:id/items/:itemid  ->  show a list item
 * POST     /:id/items          ->  append a new list item
 * PUT      /:id/items/:itemid  ->  modify a list item
 * DELETE   /:id/items/:itemid  ->  delete a list item
 */


router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

//router.get('/:id/providers', controller.showProviders);
//router.put('/:id/providers', controller.updateProviders);
//router.patch('/:id/providers', controller.updateProviders);

router.get('/:id/items/:itemid', controller.showItem);
router.post('/:id/items', auth.isAuthenticated(), controller.createItem);
router.put('/:id/items/:itemid', auth.isAuthenticated(), controller.updateItem);
router.patch('/:id/items/:itemid', auth.isAuthenticated(), controller.updateItem);
router.delete('/:id/items/:itemid', auth.isAuthenticated(), controller.destroyItem);

module.exports = router;