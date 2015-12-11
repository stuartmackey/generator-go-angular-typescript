"use strict";

var gulp = require("gulp"),
    del = require("del"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    inject = require("gulp-inject"),
    plumber = require("gulp-plumber"),
    sourcemaps = require("gulp-sourcemaps"),
    CacheBuster = require("gulp-cachebust"),
    concat = require("gulp-concat"),
    ngAnnotate = require("gulp-ng-annotate"),
    uglify = require("gulp-uglify"),
    bowerFiles = require('main-bower-files'),
    less = require("gulp-less"),
    minifyCSS = require("gulp-minify-css"),
    Config = require("./gulp.config.js"),
    replace = require('gulp-replace'),
    minimist = require('minimist'),
    gulpif = require('gulp-if');

var config = new Config();
var cachebust = new CacheBuster();

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'local' }
};
var options = minimist(process.argv.slice(2), knownOptions);

gulp.task("wiredep", function (cb) {

});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task("clean-ts", function (cb) {
  var typeScriptGenFiles = [config.tsOutputPath];

  // delete the files
  del(typeScriptGenFiles, cb);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task("ts-lint", function () {
    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report("prose"));
});

/**
* Generates the app.d.ts references file dynamically from all application *.ts files.
*/
gulp.task("gen-ts-refs", function () {
   var target = gulp.src(config.appTypeScriptReferences);
   var sources = gulp.src([config.allTypeScript], {read: false});
   return target.pipe(inject(sources, {
       starttag: "//{",
       endtag: "//}",
       transform: function (filepath) {
           return "/// <reference path='../.." + filepath + "' />";
       }
   })).pipe(gulp.dest(config.typings));
});

/**
 * Inject generated into app.php
 */
gulp.task("inject-ts", ["compile-ts"], function() {
   return gulp.src('index.html')
   	.pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(inject(gulp.src(config.allGeneratedJs, {read: false})))
    .pipe(gulp.dest('./'));
});


/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task("compile-ts", ["gen-ts-refs"], function () {
  var typeScriptGenFiles = [config.tsOutputPath];
  del(typeScriptGenFiles);

  var sourceTsFiles = [config.allTypeScript,
                        config.ignoreTypeScript,
                        config.libraryTypeScriptDefinitions, //reference to library .d.ts files
                        config.appTypeScriptReferences];     //reference to app.d.ts files


  var tsResult = gulp.src(sourceTsFiles)
                      .pipe(plumber())
                      .pipe(gulpif(options.env === 'master', replace(/@@API_END_POINT/g, config.live_api_endpoint)))
                      .pipe(gulpif(options.env === 'develop', replace(/@@API_END_POINT/g, config.beta_api_endpoint)))
                      .pipe(gulpif((options.env !== 'master' && options.env !== 'develop'), replace(/@@API_END_POINT/g, config.dev_api_endpoint)))
                      .pipe(sourcemaps.init({loadMaps: true}))
                      .pipe(tsc({
                        target: "ES5",
                        declarationFiles: false,
                        noExternalResolve: true
                      }));

  tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
  return tsResult.js
                  .pipe(concat("app.js"))
                  .pipe(ngAnnotate())
                  .pipe(gulpif(options.env === 'master', uglify())) // only minify in production
                  .pipe(cachebust.resources())
                  .pipe(gulp.dest(config.tsOutputPath));
});


/**
 * Remove all generated css from less compilation
 */
gulp.task("clean-less", function (cb) {
  var lessGenFiles = [config.lessOutputPath];

  // delete the files
  del(lessGenFiles, cb);
});

/**
 * Compile less files
 */
gulp.task("compile-less", ['clean-less'], function() {
  return gulp.src(config.allLess)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat("app.css"))
    .pipe(minifyCSS())
    .pipe(cachebust.resources())
    .pipe(gulp.dest(config.lessOutputPath));
 });

 /**
  * Inject generated into app.php
  */
gulp.task("inject-less",['compile-less'], function() {
  return gulp.src('index.html')
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(inject(gulp.src(config.allGeneratedCss, {read: false})))
    .pipe(gulp.dest('./'));
});


gulp.task("watch", function() {
    gulp.watch([config.allTypeScript], ["ts-lint", "inject-ts"]);
});

gulp.task("default", ["ts-lint", "inject-ts", "inject-less", "watch"]);