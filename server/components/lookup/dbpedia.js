var host = "lookup.dbpedia.org";

var oboe = require('oboe');
var http = require('http');
var events = require('events');




/* Searches for the given term and returns as events.
   Listeners should listen to:
    done - the results have all been returned
    error(object) - an error occured
    result(object) - a result was returned */
exports.search = function(term ) {
  var emitter = new events.EventEmitter();

  var options = {
    hostname: host,  
    port: 80,
    path: lookupPath(term),
    method: 'GET',
    headers: {"Accept": "application/json"}
  }
  var request = http.request(options, function (response) {
    //create an oboe stream from the search
    //oboe will parse the incoming javascript according to the supplied patterns
    oboe(response)
      //for each definition object (one that has a dmid property)
      .node('results..{uri description}', function (resource) {
       //bundle the definition object as a lookup result
       //the lookup result should have:
          //a URI for the result as linked data
          //a description? (in what language?)
          //arbitrary json object
        var result = {
          uri: resource.uri,
          description: resource.description,
          object: resource 
        }
        emitter.emit('result', result);
        
      })
      .done(function () {
        emitter.emit('done');
      });

  });

  //if the request errors, pass the error on as an event
  request.on('error', function(e) {
    emitter.emit('error', e);
  });

  //the request must be closed (no data is written to its body)
  request.end();

  return emitter;
}
  


function lookupUrl(term) {
  return baseURL+lookupPath;
}

/* Looks up the given expression . */
function lookupPath(term) {
  return "/api/search.asmx/KeywordSearch?QueryString="+term;
}

function definedMeaningUri(meaning) {
  return baseURL+"/DefinedMeaning:"+meaning;
}