'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

setUpEnvironment();

var app = require("./app.js");

var debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
_mongoose2.default.Promise = Promise;

// connect to mongo db
_mongoose2.default.connect(process.env.db, { server: { socketOptions: { keepAlive: 1 } } });
_mongoose2.default.connection.on('error', function () {
  throw new Error('unable to connect to database: ' + process.env.db);
});

// print mongoose logs in dev env
if (process.env.MONGOOSE_DEBUG) {
  _mongoose2.default.set('debug', function (collectionName, method, query, doc) {
    debug(collectionName + '.' + method, _util2.default.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(process.env.port, function () {
    debug('server started on port ' + config.port + ' (' + config.env + ')');
  });
}

function setUpEnvironment() {
  require("./config/envloader")();
}

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
