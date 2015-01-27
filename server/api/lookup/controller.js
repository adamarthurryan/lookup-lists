'use strict';

var _ = require('lodash');
var http = require('http');

var lookup = require('../../components/lookup');

exports.dbpediatest = function (req, res) {
  console.log("dbpediatest");
  var options = {
    hostname: 'lookup.dbpedia.org',
    port: 80,
    path: '/api/search.asmx/KeywordSearch?QueryString=berlin',
    method: 'GET',
    headers: {"Accept": "application/json"}
  } 

  var request = http.request(options, function(queryResponse) {
    res.type('application/json');
    queryResponse.pipe(res);
    /*
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  */
  });
  
  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  request.end();
}

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
