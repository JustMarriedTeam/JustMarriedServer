/* global process JSON */
import gulp from "gulp";
import rename from "gulp-rename";
import {log} from "gulp-util";
import gulpLoadPlugins from "gulp-load-plugins";
import path from "path";
import del from "del";
import runSequence from "run-sequence";
import yaml from "gulp-yaml";
import minimist from "minimist";
import pick from "lodash/pick";
import keys from "lodash/keys";
import extend from "lodash/extend";

const defaultConfig = {
  ENVIRONMENT: "production",
  LOG_LEVEL: "production"
};

const plugins = gulpLoadPlugins();

const options = extend(
  {},
  defaultConfig,
  pick(extend({}, process.env, minimist(process.argv)), ...keys(defaultConfig))
);

const config = {
  src: {
    main: {
      baseDir: "src/main",
      dirName: "main"
    },
    test: {
      baseDir: "src/test",
      dirName: "test"
    },
    baseDir: "src",
    nonJs: "**/*.{json}"
  },
  coverageDir: "./coverage",
  distDir: "./dist",
  build: {
    baseDir: "build",
    mainDir: "build/main",
    testDir: "build/test"
  },
  env: {
    file: options.ENVIRONMENT !== "local" ? `./config/${options.ENVIRONMENT}.json` : ".env.json"
  }
};

gulp.task("clean", () =>
    del([`${config.build.baseDir}/**`, `${config.coverageDir}/**`,
      `!${config.build.baseDir}`, `!${config.coverageDir}`])
);

gulp.task("copyNonJs", () =>
    gulp.src(`${config.src.baseDir}/${config.src.nonJs}`)
        .pipe(gulp.dest(config.build.baseDir))
);

gulp.task("yamlToJson", () =>
    gulp.src(`${config.src.baseDir}/**/*.yaml`)
        .pipe(yaml({}))
        .pipe(gulp.dest(config.build.baseDir))
);

gulp.task("copyEnvProps", () =>
    gulp.src(config.env.file)
        .on("data", () => log(`Copying property file ${config.env.file}`))
        .pipe(rename("env.properties"))
        .pipe(gulp.dest(config.build.mainDir))
);

gulp.task("mainCompile", () =>
    gulp.src(`${config.src.main.baseDir}/**/*.js`, {base: "./src"})
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel())
        .pipe(plugins.sourcemaps.write(".", {
          includeContent: false,
          sourceRoot: "./src"
        }))
        .pipe(gulp.dest(config.build.baseDir))
);

gulp.task("testCompile", () =>
    gulp.src(`${config.src.test.baseDir}/**/*.js`, {base: "./src"})
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel())
        .pipe(plugins.sourcemaps.write(".", {
          includeContent: false,
          sourceRoot: "./src"
        }))
        .pipe(gulp.dest(config.build.baseDir))
);

gulp.task("dist", ["build"], () =>
    gulp.src(`${config.build.mainDir}/**/*`)
        .pipe(plugins.minify({
          ext: {
            src: ".js",
            min: ".js"
          },
          noSource: true
        }))
        .pipe(gulp.dest(config.distDir))
);

gulp.task("nodemon", ["copyResources", "compile"], () =>
    plugins.nodemon({
      execMap: {
        js: "node-inspector & node --debug-brk=5860"
      },
      script: path.join(config.build.mainDir, "index.js"),
      ext: "js yaml",
      delay: 2500,
      debug: true,
      verbose: true,
      legacyWatch: true,
      watch: config.src.main.baseDir,
      tasks: ["copyNonJs", "yamlToJson", "compile"]
    })
);

gulp.task("compile", ["mainCompile", "testCompile"]);
gulp.task("copyResources", ["copyNonJs", "copyEnvProps", "yamlToJson"]);
gulp.task("build", ["clean", "copyResources", "compile"]);
gulp.task("serve", ["clean"], () => runSequence("nodemon"));
gulp.task("default", ["clean"], () =>
    runSequence(["dist"])
);
