import envFile from 'node-env-file';

module.exports = (function(envFile) {

    const env = process.env.NODE_ENV || 'development';

    function setEnv() {
        envFile(__dirname + '/.env.properties');
        envFile(__dirname + `config/env/${env}`, {overwrite: true, raise: false});
        envFile(`${env}`, {overwrite: true});
    }

    function printEnv() {
        console.log("jwtToken", process.env.jwtToken);
    }

    return function() {
        setEnv();
        printEnv();
    }

})(envFile);