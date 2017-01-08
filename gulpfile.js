'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const jsFiles = ["app/js/*.js", "app/js/**/*.js"];
const spriteDir = ["app/img/sprites/*"];


// default task
gulp.task("default", ["concat-js", "compile-sass"], function(){

    // iniciar BrowserSync
    browserSync.init({
        server: "./",
        browser: "google chrome"
    });
    // watch scsc
    gulp.watch("app/scss/*.scss", ["compile-sass"]);
    // watch html
    gulp.watch("*.html").on("change", browserSync.reload);
    // watch js
    gulp.watch(jsFiles, ["concat-js"]);
    gulp.watch(spriteDir, ["spritesheet"]);

});

gulp.task("compile-sass", function(){
    gulp.src("./app/scss/main.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./dist/css/"))
        .pipe(notify({
            title: "SASS",
            message: "Compiled"
        }))
        .pipe(browserSync.stream());
});


gulp.task("concat-js", function(){
    gulp.src("app/js/app.js")
        .pipe(sourcemaps.init())
        .pipe(tap(function(file){
            file.contents = browserify(file.path).bundle();
        }))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist/js/"))
        .pipe(notify({
            title: "JS",
            message: "Concatenated"
        }))
        .pipe(browserSync.stream());
});