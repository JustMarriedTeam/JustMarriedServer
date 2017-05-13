import nconf from "nconf";

const REQUIRED_PROPERTIES = [
  "LOG_LEVEL",
  "EXPRESS_LOGGING",
  "PROTOCOL",
  "HOST",
  "PORT",
  "DOMAIN",
  "DB_URL",
  "JWT_SECRET"
];

nconf.use("memory");

nconf.env([
  "SESSION_SECRET",
  "MEMCACHED_SERVERS",
  "MEMCACHED_USERNAME",
  "MEMCACHED_PASSWORD",
  ...REQUIRED_PROPERTIES
]);

nconf.file("application", `${__dirname}/env.properties`);
nconf.required(REQUIRED_PROPERTIES);

export default nconf;
