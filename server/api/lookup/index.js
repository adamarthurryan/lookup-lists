var express = require('express');
var controller = require('./controller');

var router = express.Router();





//get a list of providers
router.get('/providers', controller.providers);

//look up a search term will all providers
router.get('/:term', controller.lookup);

//look up a search term with the given provider
router.get('/:term/provider/:provider', controller.lookupWithProvider);


module.exports = router;