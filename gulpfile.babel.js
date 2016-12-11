import gulp from 'gulp';
import rename from 'gulp-rename';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import commandLineArgs from 'command-line-args';
import yaml from 'gulp-yaml'


const plugins = gulpLoadPlugins();

const options = commandLineArgs([
    {name: 'env', type: String}
]);

const config = {
    src: {
        main: {
            baseDir: 'src/main',
            dirName: 'main'
        },
        test: {
            baseDir: 'src/test',
            dirName: 'test'
        },
        baseDir: 'src',
        nonJs: '**/*.{json}'
    },
    coverageDir: './coverage',
    distDir: './dist',
    build: {
        baseDir: 'build',
        mainDir: 'build/main',
        testDir: 'build/test'
    }
};

gulp.task('clean', () =>
    del([`${config.build.baseDir}/**`, `${config.coverageDir}/**`, `!${config.build.baseDir}`, `!${config.coverageDir}`])
);

gulp.task('copyNonJs', () =>
    gulp.src(`${config.src.baseDir}/${config.src.nonJs}`)
        .pipe(gulp.dest(config.build.baseDir))
);

gulp.task('yamlToJson', () =>
    gulp.src(`${config.src.baseDir}/**/*.yaml`)
        .pipe(yaml({}))
        .pipe(gulp.dest(config.build.baseDir))
);

gulp.task('copyEnvProps', () =>
    gulp.src(!!options.env ? `./config/${options.env}.properties` : '.env.properties')
        .pipe(rename('env.properties'))
        .pipe(gulp.dest(config.build.mainDir))
);

gulp.task('mainCompile', () =>
    gulp.src(`${config.src.main.baseDir}/**/*.js`, {base: './src'})
        .pipe(plugins.babel())
        .pipe(gulp.dest(config.build.baseDir))
);

gulp.task('testCompile', () =>
    gulp.src(`${config.src.test.baseDir}/**/*.js`, {base: './src'})
        .pipe(plugins.babel())
        .pipe(gulp.dest(config.build.baseDir))
);

gulp.task('dist', ['build'], () =>
    gulp.src(`${config.build.mainDir}/**/*`)
        .pipe(gulp.dest(config.distDir))
);

gulp.task('nodemon', ['copyResources', 'compile'], () =>
    plugins.nodemon({
        script: path.join(config.build.mainDir, 'index.js'),
        ext: 'js',
        delay: 2500,
        watch: config.src.main.baseDir,
        tasks: ['copyResources', 'compile']
    })
);

gulp.task('compile', ['mainCompile', 'testCompile']);
gulp.task('copyResources', ['copyNonJs', 'copyEnvProps', 'yamlToJson']);
gulp.task('build', ['copyResources', 'compile']);
gulp.task('serve', ['clean'], () => runSequence('nodemon'));
gulp.task('default', ['clean'], () =>
    runSequence(['build'])
);
