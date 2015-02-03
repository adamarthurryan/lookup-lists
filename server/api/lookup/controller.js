'use strict';

var _ = require('lodash');
var http = require('http');

var lookup = require('../../components/lookup');


exports.providers = function (req, res) {
  var providers = lookup.providers();

  res.type('application/json');
  res.json(providers);
}


/* Looks up the given term with all registered providers. */
exports.lookup = function (req, res) {
  var term = req.params.term;
  var parameters = req.query;
  var stream = lookup.lookup(term, parameters);

  res.type('application/json');
  stream.pipe(res);
}

/* Looks up the given term with the given provider.*/
exports.lookupWithProvider = function (req, res) {
  var term = req.params.term;
  var key = req.params.provider;
  var parameters = req.query;
  console.log(JSON.stringify(parameters));
  console.log(parameters);
 
  var stream = lookup.lookupWithProvider(term, key, parameters);

  res.type('application/json');
  stream.pipe(res);  
}
