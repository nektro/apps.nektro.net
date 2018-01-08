/* jshint esversion:6 */
const gulp = require('gulp');
const gih = require("gulp-include-html");

gulp.task('default', function() {
    gulp.src('./src/**/*.html')
    .pipe(gih())
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('bin'));

    gulp.src('./src/**/*.{css,js,png}')
    .pipe(gulp.dest('bin'));
});
