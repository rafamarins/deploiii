module.exports = function() {

    this.appRoot = require('app-root-path');
    this.config = require(appRoot.path + '/config/config.json');
    this.gulp = require('gulp');
    this.watch = require('gulp-watch');
    this.batch = require('gulp-batch');
    this.concat = require('gulp-concat');
    this.sass = require('gulp-sass');
    this.uglify = require('gulp-uglify');
    this.autoprefixer = require('gulp-autoprefixer');
    this.insert = require('gulp-insert');
    this.inject = require('gulp-inject-string');
    this.rename = require('gulp-rename');
    this.notify = require('gulp-notify');
    this.obfuscator = require('gulp-javascript-obfuscator');
    this.runSequence = require('run-sequence');
    this.del = require('del');
    this.pump = require('pump');
    this.gutil = require('gulp-util');
    this.ftp = require('vinyl-ftp');
    this.path = require('path');
    this.imagemin = require('gulp-imagemin');
    this.utils = require('./utils.js')();
}