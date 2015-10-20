/**
 * Created by Praveen on 27/08/2015.
 */

var gulp        = require('gulp');
var sourcemaps  = require("gulp-sourcemaps");
var babel       = require("gulp-babel");
var concat      = require("gulp-concat");
var mocha       = require('gulp-mocha');
var eslint      = require('gulp-eslint');
var nodemon     = require('gulp-nodemon');
var uglify      = require('gulp-uglify');
var browserify  = require('browserify');
var babelify    = require('babelify');
var watchify    = require('watchify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');

gulp.task('test', function () {
    var babel_c = require('babel/register');
    return gulp.src(['test/*-test.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'list',
            compilers: {
                js: babel_c
            }
        }));
});

gulp.task('lint', function() {
    return gulp.src('./js/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('server', function () {
    'use strict';
    nodemon({
        script: 'server.js',
        ext: 'html js'
    }).on('restart', function() {
        console.log('Restarted server');
    });

});

gulp.task('dist', function() {
    var options = {
        entries: ['./js/Index.js'],
        debug: true
    };

    browserify(options)
        .transform(babelify)
        .bundle()
        .on('error', function(err) {console.error(err); this.emit('end');} )
        .pipe(source('all.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('test-dist', function() {
    var options = {
        entries: ['./test/test-redux-wiring.js'],
        debug: true
    };

    browserify(options)
        .transform(babelify)
        .bundle()
        .on('error', function(err) {console.error(err); this.emit('end');} )
        .pipe(source('test.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    var options = {
        cache: {},
        packageCache: {},
        fullPaths: true,
        debug: true
    };

    function rebundle(b) {
        b.transform(babelify)
            .bundle()
            .on('error', function(err) {console.error(err); this.emit('end');} )
            .pipe(source('all.min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(uglify())
            .pipe(gulp.dest('dist'));
    }

    var wb = watchify(browserify(options));
    wb.on('update', function() {
        rebundle(wb);
    });

    wb.add('./js/Index.js');
    rebundle(wb);
});