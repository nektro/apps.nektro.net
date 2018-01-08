/* jshint esversion:6 */
const gulp = require('gulp');
const gih = require("gulp-include-html");

gulp.task('default', function() {
    gulp.src('./src/**/*.*')
    //.pipe(gih())
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('bin'));
});
