const gulp = require('gulp');
const gih = require('gulp-include-html');
const sitemap = require('gulp-sitemap');
const ts = require('gulp-typescript');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('html', function() {
    return gulp.src('./src/**/*.{html,json}')
    .pipe(gih())
    .pipe(gulp.dest('bin'));
});

gulp.task('static', function() {
    return gulp.src('./src/**/*.{css,js,png}')
    .pipe(gulp.dest('bin'));
});

gulp.task('typescript', function() {
    return gulp.src('src/**/*.ts')
    .pipe(ts({ target: 'ES6' }))
    .pipe(gulp.dest('bin'));
});

gulp.task('sass', function () {
    return gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sourcemaps.write())
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
    'html', 'static', 'typescript', 'sass'
]);

gulp.task('default', [
    'site-dev', 'netlify', 'sitemap'
]);
