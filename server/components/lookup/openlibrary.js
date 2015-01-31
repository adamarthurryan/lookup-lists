var host = "openlibrary.org";

var oboe = require('oboe');
var http = require('http');
var events = require('events');

/* Searches for the given term and returns results to the callback.*/
exports.search = function(term, callbackDone, callbackResults ) {
  term = term.split(' ').join('+');
  console.log(lookupPath(term));


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
      //for each document result
      .node('docs..{title author_name first_publish_year key}', function (resource) {
        //bundle the document object as a lookup result
        //the lookup result should have:
          //a URI for the result as linked data
          //a description? (in what language?)
          //arbitrary json object
        var result = {
          uri: "https://"+host+resource.key,
          description: resource.title +", "+resource.author_name+", "+resource.first_publish_year,
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
  return "/search.json?title="+term;
}
