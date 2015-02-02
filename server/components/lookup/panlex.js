// panlex.js

// an example query:
// retrieves translations of 'fight' from english to german
// return values include trq: the translation quality

{
  url: "http://api.panlex.org/ex"
  body: { 
    "include":["trlv", "trtt", "trq"], 
    "trlv":[187], 
    "uid":["deu-000"], 
    "trtt": ["fight"], 
    "indent":true 
    } 
}