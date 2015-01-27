'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// an item in a lookup list
var ItemSchema = new Schema({
  //is described by a term
  term: String,
  //for which a number of search results are saved
  results: [ResultSchema],

  //should the lookup configuration be saved?
  // providers: [ProviderSchema],

});

//a lookup result
var ResultSchema = new Schema({
  //has a uri
  uri: String,
  //a description
  description: String,
  //might be hidden
  hidden: Boolean,
  //was returned by a provider
  provider: String,
  //and has mixed data, the format of which is determined by the provider
  object: {},
  
  //should we instead record the provider with its parameters?
  //provider: [ProviderSchema],
})

//a lookup provider
var ProviderSchema = new Schema ({
  //has a key
  key: String,
  //and is configured by an array of (name,value) pairs
  params: [{name: String, value: String}]
});

// a list 
var ListSchema = new Schema({
  //is owned by a user
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  //has a title
  title: String,
  //has a list of lookup providers
  providers: [ProviderSchema],
  //and has a list of items
  items: [ItemSchema],
});


module.exports = mongoose.model('List', ListSchema);