/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var list = require('./list.model');

exports.register = function(socket) {
  list.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  list.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('list:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('list:remove', doc);
}