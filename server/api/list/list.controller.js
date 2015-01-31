
'use strict';

var List = require('./list.model');
var mongoose = require('mongoose');
var _ = require('lodash');

// Get list of lists
exports.index = function(req, res) {
  List.find()
  .populate('owner', '_id name')
  .exec(function (err, lists) {
    if(err) { return handleError(res, err); }
    return res.json(200, lists);
  });
};

// Get a single list
exports.show = function(req, res) {
  List.findById(req.params.id)
  .populate('owner', '_id name').
  exec(function (err, list) {
    if(err) { return handleError(res, err); }
    if(!list) { return res.send(404); }
    return res.json(list);
  });
};

// Creates a new list in the DB.
exports.create = function(req, res) {
  //we do not allow the api client to change the owner willy-nilly!
  if (req.body.owner) { delete req.body.owner; }

  //add the current user to the list object
  var list = _.merge(req.body, {owner: req.user._id});

  List.create(list, function(err, list) {
    if(err) { return handleError(res, err); }
    return res.json(201,list);
  });
};

// Updates an existing list in the DB.
exports.update = function(req, res) {
  //delete the id parameter in the request body
  //we do not allow the api client to change ids willy-nilly!
  if(req.body._id) { delete req.body._id; }

  //we do not allow the api client to change the owner willy-nilly!
  if (req.body.owner) { delete req.body.owner; }

  //find the list
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    // require user authentication
    if (! mongoose.Types.ObjectId(list.owner).equals(req.user._id))
      {return res.send(401);}

    //merge in the new values
    var updated = _.merge(list, req.body);

    //save and return
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, list);
    });
  });
};

// Deletes a list from the DB.
exports.destroy = function(req, res) {
  // find the list
  List.findById(req.params.id, function (err, list) {
    if(err) { return handleError(res, err); }
    if(!list) { return res.send(404); }
    
    // require user authentication
    if (! mongoose.Types.ObjectId(list.owner).equals(req.user._id))
      {return res.send(401);}

    // and remove it
    list.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// shows a list item
exports.showItem = function(req, res) {
  
  //lookup the given list
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    //lookup the item
    var item = list.items.id(req.params.itemid);
    if (!item) { return res.send(404); }

    //and return it
    return res.json(item);
  });
}

// Creates a new list item in the DB.
exports.createItem = function(req, res) {
  //delete the id parameter in the request body
  //we do not allow the api client to change ids willy-nilly!
  if(req.body._id) { delete req.body._id; }

  //lookup the given list
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    // should require user authentication
    if (! mongoose.Types.ObjectId(list.owner).equals(req.user._id))
      {return res.send(401);}

    //add the item to the list 
    var index = list.items.push(req.body) -1;
    var item = list.items[index];

    //save and return
    list.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(201, item);
    });
  });
}

 

// updates a list item
exports.updateItem = function(req, res) {
  console.log('updateItem');
  console.log('list id: '+req.params.id);
  console.log('item id: '+req.params.itemid);

  //delete the id parameter and owner parameter in the request body
  //we do not allow the api client to change ids willy-nilly!
  if(req.body._id) { delete req.body._id; }

  //lookup the given list
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    // should require user authentication
    if (! mongoose.Types.ObjectId(list.owner).equals(req.user._id))
      {return res.send(401);}

    
    //lookup the item
    var item = list.items.id(req.params.itemid);

    if (!item) { return res.send(404); }

    //console.log(JSON.stringify(item));
    //console.log(JSON.stringify(req.body));


    //merge the passed item with the existing item
    var updatedItem = _.merge(item, req.body);

    //replace the original item in the list
    list.items.pull(item);
    list.items.push(updatedItem);

    console.log(list);

    //is it now in the list or do we have to do something like the following?
    //item.remove();
    //list.items.push(updatedItem);

    //and save
    list.save(function (err) {
      if (err) { return handleError(res, err); }
      //returning the updated item
      return res.json(200, updatedItem);
    });
  });
};

// deletes a list item
exports.destroyItem = function(req, res) {
  //lookup the given list
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    // should require user authentication
    if (! mongoose.Types.ObjectId(list.owner).equals(req.user._id))
      {return res.send(401);}

    //lookup the item 
    var item = list.items.id(req.params.itemid);
    if (!item) { return res.send(404); }
    //and delete it from the list
    item.remove();

    //and save the list
    list.save(function (err) {
      if (err) { return handleError(res, err); }
      
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}