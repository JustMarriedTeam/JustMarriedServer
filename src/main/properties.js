import envFile from 'node-env-file';
import extend from 'lodash/extend';
import pick from 'lodash/pick';

const passedEnvVariables = pick(process.env,
    'logLevel', 'protocol', 'host', 'port', 'domain', 'envPropsFile', 'dbUrl', 'jwtSecret');
envFile(`${__dirname}/env.properties`);
const envPropsFile = passedEnvVariables['envPropsFile'];
if(!!envPropsFile) {
    envFile(envPropsFile, {overwrite: true, raise: false});
}

export default extend({}, process.env, passedEnvVariables);