
'use strict';

var List = require('./list.model');


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
  List.create(req.body, function(err, list) {
    if(err) { return handleError(res, err); }
    
    // !!! how is this tied to the current user?
    //is this how?
    list.owner = req.user;
    return res.json(201, list);
  });
};

// Updates an existing list in the DB.
exports.update = function(req, res) {
  //delete the id parameter in the request body
  //we do not allow the api client to change ids willy-nilly!
  if(req.body._id) { delete req.body._id; }

  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    // !!! should require user authentication
    // is this right?
    if (list.owner != req.user)
      {return res.send(401);}

    var updated = _.merge(list, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, list);
    });
  });
};

// Deletes a list from the DB.
exports.destroy = function(req, res) {
  List.findById(req.params.id, function (err, list) {
    if(err) { return handleError(res, err); }
    if(!list) { return res.send(404); }
    
    // !!! should require user authentication
    // is this right?
    if (list.owner != req.user)
      {return res.send(401);}

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

    // !!! should require user authentication
    // is this right?
    if (list.owner != req.user)
      {return res.send(401);}

    //add the item to the list 
    var item = list.items.push(req.body);

    //and save
    list.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(201, updatedItem);
    });
  });
}

 

// updates a list item
exports.updateItem = function(req, res) {
  //delete the id parameter in the request body
  //we do not allow the api client to change ids willy-nilly!
  if(req.body._id) { delete req.body._id; }

  //lookup the given list
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    // !!! should require user authentication
    // is this right?
    if (list.owner != req.user)
      {return res.send(401);}

    //lookup the item
    var item = list.items.id(req.params.itemid);
    if (!item) { return res.send(404); }

    //merge the passed item with the existing item
    var updatedItem = _.merge(item, req.body);

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

    // !!! should require user authentication
    // is this right?
    if (list.owner != req.user)
      {return res.send(401);}

    //lookup the item 
    var item = list.items.id(req.params.itemid);
    if (!item) { return res.send(404); }
    //and delete it from the list
    item.remove();

    //and save the list
    list.save(function (err) {
      if (err) { return handleError(res, err); }
      
      return res.send(204, updatedItem);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}