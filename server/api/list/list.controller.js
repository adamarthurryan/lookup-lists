
'use strict';

var List = require('./list.model');


/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /lists              ->  index
 * POST    /lists              ->  create
 * GET     /lists/:id          ->  show
 * PUT     /lists/:id          ->  update
 * DELETE  /lists/:id          ->  destroy
 */

// Get list of lists
exports.index = function(req, res) {
  List.find()
  .populate('user', '_id name')
  .exec(function (err, lists) {
    if(err) { return handleError(res, err); }
    return res.json(200, lists);
  });
};

// Get a single list
exports.show = function(req, res) {
  List.findById(req.params.id)
  .populate('user', '_id name').
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
    list.user = req.user;
    return res.json(201, list);
  });
};

// Updates an existing list in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    // !!! should require user authentication
    // is this right?
    if (!list.user == req.user)
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
    if (!list.user == req.user)
      {return res.send(401);}

    list.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}