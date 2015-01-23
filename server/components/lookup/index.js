var _ = require('lodash');

var Readable = require('stream').Readable;

// the providers hashtable
var providers = {};

//register the providers

var providerOmegawiki = require('./omegawiki');
registerProvider('omegawiki', providerOmegawiki);

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

  //for each provider
  _.each(_.keys(providers), function (key) {
    count++;
    doLookup(term, key, stream, function() {
      //when all the providers have returned, then we can close the stream
      if (count-- <= 0) {
        stream.push(']}');
        stream.push(null);
      }
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

  doLookup(term, key, stream, function() {
    //when the results are all in, close the stream
    stream.push(']}');
    stream.push(null);
  });

  return stream;
}

/* Looks up the given term with the given provider, writing the results to 
  the given string. When the results are in, the given callback will be called.*/
function doLookup (term, key, stream, callbackDone) {
  var provider = providers[key];

  var isFirstResult = true;

  //get the results
  provider.search(term, callbackDone, function(err, result) {

    if (err) {
      //the output will be information about the provider
      output = {
        no_result: {
          provider: key,
          term: term,
          object: err
        }
      }

      if (!isFirstResult) 
        stream.push(', ');

      stream.push(JSON.stringify(output));
      isFirstResult=false;
      return;
    } 
      
    //add information about the provider
    //and verify that the results have the right structure
    output = {
      result: {
        provider: key,
        term: term,
        uri: result.uri,
        description: result.description,
        object: result.object,
      }
    }
    //then push the result to the stream

    if (!isFirstResult)
      stream.push(', ');
    stream.push(JSON.stringify(output));
    isFirstResult=false;
  });
}