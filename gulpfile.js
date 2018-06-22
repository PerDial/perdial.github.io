var gulp = require("gulp");
var fs = require("fs");
var ejs = require("gulp-ejs");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");

gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./docs",
            startPath: '/perdial/',
            routes : {
                '/perdial': 'docs'
            }
        }
    });
});

gulp.task("ejs", function() {
    var json = JSON.parse(fs.readFileSync("./source/variables.json"));
    gulp.src(["./source/**/*.ejs", "!./source/template/*.ejs"], { base: "./source" })
        .pipe(plumber())
        .pipe(ejs(json, {}, {ext: ".html"}))
        .pipe(gulp.dest("./docs/"))
        .pipe(browser.reload({stream:true}));
});
 
gulp.task("sass", function() {
    gulp.src("./source/**/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest("./docs/"))
        .pipe(browser.reload({stream:true}));
});

gulp.task("js", function() {
    gulp.src(["./source/**/*.js"])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest("./docs/"))
        .pipe(browser.reload({stream:true}));
});

gulp.task("reload", function() {
    browser.reload();
});

gulp.task("default", ["server"], function() {
    gulp.watch("./source/**/*.ejs", ["ejs"]);
    gulp.watch("./source/**/*.js",  ["js"]);
    gulp.watch("./source/**/*.scss",["sass"]);
});
