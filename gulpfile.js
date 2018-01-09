/* jshint esversion:6 */
const gulp = require('gulp');
const gih = require("gulp-include-html");

gulp.task('html', function() {
    gulp.src('./src/**/*.{html,json}')
    .pipe(gih())
    .pipe(gulp.dest('bin'));
});

gulp.task('static', function() {
    gulp.src('./src/**/*.{css,js,png}')
    .pipe(gulp.dest('bin'));
});

gulp.task('default', [
    'html', 'static'
]);
