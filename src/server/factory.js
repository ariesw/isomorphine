var fs = require('fs');
var path = require('path');
var createRouter = require('./router');

/**
 * Creates an isomorphine endpoint router with entities loaded from 'baseDir'.
 *
 * @warn
 *  Isomorphine determines your entities' methods by scanning the file structure
 *  of the base directory. Every folder represents an entity,
 *  whereas every file in each folder represents an API endpoint, or "route".
 *
 * @see  /lib/server/router.js
 *
 * @providesModule   serverFactory
 *
 * @param  {String}  baseDir  Path to folder to require from.
 * @return {Object}           Required modules.
 */
module.exports = function routerFactory(baseDir) {
  var entities = requireEntities(baseDir);
  var router = createRouter(entities);

  // Exposes the entities in the router's surface area
  for (var key in entities) {
    router[key] = entities[key];
  }

  return router;
};

/**
 * Requires the entities in dir.
 *
 * @param  {String}  dir  The base directory to require entities from.
 * @return {Object}       An object with all the modules loaded.
 */
function requireEntities(dir) {
  var modules = {};
  var entities = fs.readdirSync(dir);

  entities.forEach(function(entity) {
    if (entity.indexOf('.js') > -1) return; // Only get folders

    var methods = fs.readdirSync(path.join(dir, entity));

    methods.forEach(function(method) {
      if (method.indexOf('.js') < 0 || method === 'index.js') return;
      method = method.replace('.js', '');
      modules[entity] = modules[entity] || {};
      modules[entity][method] = require(path.join(dir, entity, method));
    });
  });

  return modules;
}