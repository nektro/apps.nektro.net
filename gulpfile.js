const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const sitemap = require("gulp-sitemap");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");

const DEST = "bin";

gulp.task("html", function() {
    return gulp.src("./src/**/*.html")
    .pipe(fileinclude({}))
    .pipe(gulp.dest(DEST));
});

gulp.task("static", function() {
    return gulp.src("./src/**/*.{css,js,png,corgi}", { dot: true })
    .pipe(gulp.dest(DEST));
});

gulp.task("sass", function () {
    return gulp.src("./src/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DEST));
});

gulp.task("netlify", function() {
    return gulp.src("./src/_headers")
    .pipe(gulp.dest(DEST));
});

gulp.task("sitemap", function() {
    return gulp.src("./src/**/index.html", { read:false })
    .pipe(sitemap({ siteUrl:"https://apps.nektro.net" }))
    .pipe(gulp.dest(DEST));
});

gulp.task("site-dev", [
    "html",
    "static",
    "sass",
]);

gulp.task("default", [
    "site-dev",
    "netlify",
    "sitemap",
]);
