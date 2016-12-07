'use strict';

var _nodeEnvFile = require('node-env-file');

var _nodeEnvFile2 = _interopRequireDefault(_nodeEnvFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (envFile) {

    var env = process.env.NODE_ENV || 'development';

    function setEnv() {
        envFile(__dirname + '/.env.properties');
        envFile(__dirname + ('config/env/' + env), { overwrite: true, raise: false });
        envFile('' + env, { overwrite: true });
    }

    function printEnv() {
        console.log("jwtToken", process.env.jwtToken);
    }

    return function () {
        setEnv();
        printEnv();
    };
}(_nodeEnvFile2.default);
//# sourceMappingURL=envloader.js.map
