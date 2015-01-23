'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
  label: String,
  lookupProvider: String,
  uri: String
});

var ListSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String,
  items: [ItemSchema],
});


module.exports = mongoose.model('List', ListSchema);