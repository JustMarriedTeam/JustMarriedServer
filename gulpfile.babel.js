import gulp from 'gulp';
import rename from 'gulp-rename';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import commandLineArgs from 'command-line-args';


const plugins = gulpLoadPlugins();

const options = commandLineArgs([
    {name: 'env', type: String}
]);

const paths = {
    main: {
        baseDir: 'main'
    },
    test : {
        baseDir: 'test',
    },
    coverageDir: './coverage',
    buildDir: './build',
    distDir: './dist'
};

gulp.task('clean', () =>
    del([`${paths.buildDir}/**`, `${paths.coverageDir}/**`, `!${paths.buildDir}`, `!${paths.coverageDir}`])
);

gulp.task('copy', () =>
    gulp.src(paths.nonJs)
        .pipe(plugins.newer('dist'))
        .pipe(gulp.dest('dist'))
);

gulp.task('copyEnvProps', () =>
    gulp.src(!!options.env ? `./config/${options.env}.properties` : '.env.properties')
        .pipe(rename('env.properties'))
        .pipe(gulp.dest('dist'))
);

gulp.task('mainCompile', () =>
    gulp.src(`./src/${paths.main.baseDir}/**/*.js`, {base: './src'})
        .pipe(plugins.babel())
        .pipe(gulp.dest(paths.buildDir))
);

gulp.task('testCompile', () =>
    gulp.src(`./src/${paths.test.baseDir}/**/*.js`, {base: './src'})
        .pipe(plugins.babel())
        .pipe(gulp.dest(paths.buildDir))
);

gulp.task('compile', ['mainCompile', 'testCompile']);

gulp.task('nodemon', ['copy', 'copyEnvProps', 'mainCompile'], () =>
    plugins.nodemon({
        script: path.join('dist', 'index.js'),
        ext: 'js',
        ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
        tasks: ['copy', 'copyEnvProps', 'babel']
    })
);

gulp.task('serve', ['clean'], () => runSequence('nodemon'));

gulp.task('default', ['clean'], () => {
    runSequence(
        ['copy', 'copyEnvProps', 'babel']
    );
});
