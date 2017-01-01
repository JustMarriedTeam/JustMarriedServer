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
  env: "production",
  logLevel: "production"
};

const plugins = gulpLoadPlugins();

const options = extend(
  {},
  defaultConfig,
  pick(minimist(process.argv), ...keys(defaultConfig))
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
    file: options.env !== "local" ? `./config/${options.env}.json` : ".env.json"
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
        js: "node-inspector & node --debug"
      },
      script: path.join(config.build.mainDir, "index.js"),
      ext: "js yaml",
      delay: 2500,
      debug: true,
      verbose: true,
      watch: config.src.main.baseDir,
      tasks: ["copyResources", "compile"]
    })
);

gulp.task("compile", ["mainCompile", "testCompile"]);
gulp.task("copyResources", ["copyNonJs", "copyEnvProps", "yamlToJson"]);
gulp.task("build", ["copyResources", "compile"]);
gulp.task("serve", ["clean"], () => runSequence("nodemon"));
gulp.task("default", ["clean"], () =>
    runSequence(["dist"])
);
