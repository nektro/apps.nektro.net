/* jshint esversion:6 */
const gulp = require('gulp');
const gih = require("gulp-include-html");

gulp.task('html', function() {
    return gulp.src('./src/**/*.{html,json}')
    .pipe(gih())
    .pipe(gulp.dest('bin'));
});

gulp.task('static', function() {
    return gulp.src('./src/**/*.{css,js,png}')
    .pipe(gulp.dest('bin'));
});

gulp.task('netlify', function() {
    return gulp.src('./src/_headers').pipe(gulp.dest('bin'));
})

gulp.task('default', [
    'html', 'static', 'netlify'
]);
