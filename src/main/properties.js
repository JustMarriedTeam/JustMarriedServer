import nconf from "nconf";

const REQUIRED_PROPERTIES = [
  "logLevel",
  "protocol",
  "host",
  "port",
  "domain",
  "dbUrl",
  "jwtSecret"
];

nconf.use("memory");

nconf.argv({
  "logLevel": {
    describe: "Logging level of the application"
  },
  "envPropsFile": {
    describe: "File that overrides properties loaded from all other files"
  }
});

nconf.env([
  "envPropsFile",
  "session.secret",
  "memcached.servers",
  "memcached.username",
  "memcached.password",
  ...REQUIRED_PROPERTIES
]);

if (nconf.get("envPropsFile")) {
  nconf.file("local", nconf.get("envPropsFile"));
}

if (nconf.get("envPropsDir")) {
  nconf.file("system", {
    dir: nconf.get("envPropsDir"),
    search: true
  });
}

nconf.file("application", `${__dirname}/env.properties`);
nconf.required(REQUIRED_PROPERTIES);

export default nconf;
