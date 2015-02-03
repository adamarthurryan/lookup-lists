var _ = require('lodash');

var Readable = require('stream').Readable;

// the providers hashtable
var providers = {};

//register the providers
registerProvider('omegawiki', require('./omegawiki'));
registerProvider('dbpedia', require('./dbpedia'));
registerProvider('openlibrary', require('./openlibrary'));
registerProvider('panlex', require('./panlex'));

/* Add the given provider to the hash. */
function registerProvider (key, provider) {
  providers[key] = provider;
}

/* Returns a list of providers.*/
exports.providers = function() { 
  providersWithParams = _.map(providers, function (provider, key){
    return {
      key: key,
      parameters: provider.parameters
    };
  });
  return providersWithParams;
}

/* Looks up the given term with all registered providers. */
exports.lookup = function (term, parameters) {
  //create a new stream to aggregate for the results
  // can we be sure that the json will arrive intact, or should we use oboe to make sure?
  var stream = new Readable();
  stream._read = function () {};
  
  stream.push('{ "results": [');

  //a counter of the number of providers upon which we are waiting for results
  var count = 0;

  var isFirstResult = true;

  //for each provider
  _.each(_.keys(providers), function (key, parameters) {


    count++;

    var lookup = doLookup(term, key, parameters);

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
exports.lookupWithProvider = function (term, key, parameters) {
  //if the provider is unknown, return an error
  //!!! We need to refactor the lookup component to be an event emitter in order for this to work
  //if (!_.has(providers,key)) 
  //  return res.send(501, 'The provider "'+key+'" is not known.');
  
  //create a new stream to aggregate the results
  var stream = new Readable();
  stream._read = function () {};
 
  stream.push('{ "results": [');

  var isFirstResult = true;

  var lookup = doLookup(term, key, parameters);

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
function doLookup (term, key, parameters) {
  var provider = providers[key];

  //var isFirstResult = true;

  //get the results
  return provider.search(term, parameters);
}