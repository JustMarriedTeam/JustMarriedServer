"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function setUpEnvironment(){_logger2.default.debug("Environment variables: "+JSON.stringify(_properties2.default)),Promise=require("bluebird")}function connectDatabase(){_mongoose2.default.Promise=Promise,Promise.promisifyAll(_mongoose2.default);var e=_properties2.default.get("dbUrl");_mongoose2.default.connect(e,{server:{socketOptions:{keepAlive:1}}}),_mongoose2.default.connection.on("error",function(){throw new Error("unable to connect to database: "+e)}),_properties2.default.get("MONGOOSE_DEBUG")&&_mongoose2.default.set("err",function(e,r,o,t){_logger2.default.error(e+"."+r,_util2.default.inspect(o,!1,20),t)})}function launchServer(){app=require("./app.js"),module.parent||!function(){var e=_properties2.default.get("port"),r=_properties2.default.get("env");_logger2.default.info("Starting server on "+e+" port"),app.listen(e,function(){_logger2.default.info("server started on port "+e+" ("+r+")")})}()}Object.defineProperty(exports,"__esModule",{value:!0});var _mongoose=require("mongoose"),_mongoose2=_interopRequireDefault(_mongoose),_util=require("util"),_util2=_interopRequireDefault(_util),_logger=require("./logger"),_logger2=_interopRequireDefault(_logger),_properties=require("./properties"),_properties2=_interopRequireDefault(_properties),app=void 0;setUpEnvironment(),connectDatabase(),launchServer(),exports.default=app,module.exports=exports.default;