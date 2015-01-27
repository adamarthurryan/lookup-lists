'use strict';

var _ = require('lodash');
var http = require('http');

var lookup = require('../../components/lookup');


exports.providers = function (req, res) {
  var keys = lookup.providers();

  var providers = _.map(keys, function(key) {
    return {
      provider: key
    };
  });

  res.type('application/json');
  res.json(providers);
}


/* Looks up the given term with all registered providers. */
exports.lookup = function (req, res) {
  var term = req.params.term;
  var stream = lookup.lookup(term);

  res.type('application/json');
  stream.pipe(res);
}

/* Looks up the given term with the given provider.*/
exports.lookupWithProvider = function (req, res) {
  var term = req.params.term;
  var key = req.params.provider;

  var stream = lookup.lookupWithProvider(term, key);

  res.type('application/json');
  stream.pipe(res);  
}
