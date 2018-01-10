/* jshint esversion:6 */
const gulp = require('gulp');
const gih = require("gulp-include-html");
const sitemap = require('gulp-sitemap');

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
});

gulp.task('sitemap', function() {
    return gulp.src('./src/**/index.html', { read:false })
    .pipe(sitemap({ siteUrl:'https://apps.nektro.net' }))
    .pipe(gulp.dest('bin'));
});

gulp.task('site-dev', [
    'html', 'static'
]);

gulp.task('default', [
    'site-dev', 'netlify', 'sitemap'
]);
