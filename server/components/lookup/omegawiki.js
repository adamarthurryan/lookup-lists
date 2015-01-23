var baseURL = "http://www.omegawiki.org";

var oboe = require('oboe');

/* Searches for the given term and returns results to the callback.*/
exports.search = function(term, callbackDone, callbackResults ) {

  //create an oboe stream from the search
  //oboe will parse the incoming javascript according to the supplied patterns
  oboe(queryUrlExpress(term))
    //for each definition object (one that has a dmid property)
    .node('ow_express..{dmid}', function (meaning) {
     //bundle the definition object as a lookup result
     //the lookup result should have:
        //a URI for the result as linked data
        //a description? (in what language?)
        //arbitrary json object
      var result = {
        uri: definedMeaningUri(meaning.dmid),
        description: meaning.definition.text,
        object: meaning 
      }

      callbackResults(null, result);
      
    })
    .node('error', function (error) {
      var error = {
        description: "not found",
      }

      callbackResults(error, null);
    })
    .done(function () {
      callbackDone();
    });
}




/* Looks up the given expression . */
function queryUrlExpress(expressionSearch) {
  return baseURL+"/api.php?action=ow_express&search="+expressionSearch+"&format=json";
}

/* Looks up definitions for the given meaning in the given language. */
function queryUrlDefine(defineMeaning, language) {
  return baseURL+"/api.php?action=ow_define&dm="+defineMeaning+"&lang="+language+"&format=json";
}

/* Looks up translations for the given meaning into the given language */
function queryUrlTrans(translateMeaning, language) {
  return baseURL+"/api.php?action=ow_syntrans&part=trans&dm="+translateMeaning+"&lang="+language+"&format=json";
}

function definedMeaningUri(meaning) {
  return baseURL+"/DefinedMeaning:"+meaning;
}