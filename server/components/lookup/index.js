var _ = require('lodash');

var Readable = require('stream').Readable;

// the providers hashtable
var providers = {};

//register the providers

var providerOmegawiki = require('./omegawiki');
registerProvider('omegawiki', providerOmegawiki);

var providerDbpedia = require('./dbpedia');
registerProvider('dbpedia', providerDbpedia);

var providerOpenLibrary = require('./openlibrary');
registerProvider('openlibrary', providerOpenLibrary);

/* Add the given provider to the hash. */
function registerProvider (key, provider) {
  providers[key] = provider;
}

/* Returns a list of providers.*/
exports.providers = function() {
  return _.keys(providers);
}

/* Looks up the given term with all registered providers. */
exports.lookup = function (term) {
  //create a new stream to aggregate for the results
  // can we be sure that the json will arrive intact, or should we use oboe to make sure?
  var stream = new Readable();
  stream._read = function () {};
  
  stream.push('{ "results": [');

  //a counter of the number of providers upon which we are waiting for results
  var count = 0;

  var isFirstResult = true;

  //for each provider
  _.each(_.keys(providers), function (key) {
    count++;

    var lookup = doLookup(term, key);

    lookup.on('result', function(result) {
      output = {
        provider: key,
        term: term,
        uri: result.uri,
        description: result.description,
        object: result.object,
      }

      if (!isFirstResult) 
        stream.push(', ');

      stream.push(JSON.stringify(output));
      isFirstResult=false;
    });

    lookup.on('done', function() {
      //when all the providers have returned, then we can close the stream
      count --;
      if (count <= 0) {
        stream.push(']}');
        stream.push(null);
      }
    });

    lookup.on('error', function(error) {
      console.log('error in lookup:' + JSON.stringify(error));
    });
  });
 
  return stream; 
}

/* Looks up the given term with the given provider.*/
exports.lookupWithProvider = function (term, key) {
  //if the provider is unknown, return an error
  if (!_.has(providers,key)) 
    return res.send(501, 'The provider "'+key+'" is not known.');
  
  //create a new stream to aggregate the results
  var stream = new Readable();
  stream._read = function () {};
 
  stream.push('{ "results": [');

  var isFirstResult = true;

  var lookup = doLookup(term, key);

  lookup.on('result', function(result) {
    output =  {
      provider: key,
      term: term,
      uri: result.uri,
      description: result.description,
      object: result.object,
    }

    if (!isFirstResult) 
      stream.push(', ');

    stream.push(JSON.stringify(output));
    isFirstResult=false;
  });

  lookup.on('done', function() {
    //the providers has returned, then we can close the stream
    stream.push(']}');
    stream.push(null);
  });

  lookup.on('error', function(error) {
    console.log('error in lookup:' + error);
  });

  return stream;
}

/* Looks up the given term with the given provider, writing the results to 
  the given string. The following events will be generated:
    done
    result
    error
    */
function doLookup (term, key) {
  var provider = providers[key];

  //var isFirstResult = true;

  //get the results
  return provider.search(term);
}