import nconf from "nconf";

const REQUIRED_PROPERTIES = [
  "EXPRESS_LOGGING",
  "PROTOCOL",
  "HOST",
  "PORT",
  "DOMAIN",
  "DB_URL",
  "JWT_SECRET",
  "SESSION_SECRET",
  "MEMCACHED_SERVERS",
  "MEMCACHED_USERNAME",
  "MEMCACHED_PASSWORD"
];

nconf.use("memory");

nconf.env([
  "DB_CONNECT_TRIES",
  "DB_CONNECT_RETRY_TIME",
  'LOG_LEVEL',
  ...REQUIRED_PROPERTIES
]);

nconf.file("application", `${__dirname}/env.properties`);
nconf.required(REQUIRED_PROPERTIES);

nconf.defaults({
  'DB_CONNECT_TRIES': 10,
  'DB_CONNECT_RETRY_TIME': 3000,
  'LOG_LEVEL': 'error'
});

export default nconf;
