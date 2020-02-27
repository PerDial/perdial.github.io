// gulp v4.0.2

const gulp = require("gulp");
const fs = require("fs");
const ejs = require("gulp-ejs");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");
const rename = require('gulp-rename')

// browser sync
gulp.task("server", () => {
    return browserSync.init({
        server: {
            baseDir: "./docs",
            startPath: '/perdial/',
            routes : {
                '/perdial': 'docs'
            }
        }
    });
});

// reload
gulp.task("reload", (done) => {
    browserSync.reload();
    done();
});

// EJS
gulp.task("ejs", () => {
    var ts = Date.now();
    var variables = JSON.parse(fs.readFileSync("./source/variables.json"));
    return gulp.src(["./source/**/*.ejs", "!./source/template/*.ejs"], { base: "./source" })
        .pipe(plumber())
        .pipe(ejs(variables))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest("./docs/"));
});
 
gulp.task("sass", function() {
    return gulp.src("./source/**/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest("./docs/"));
});

gulp.task("js", function() {
    return gulp.src(["./source/**/*.js"])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest("./docs/"));
});

// watch
gulp.task("watch", (done) => {
    gulp.watch("./source/**/*.ejs", gulp.series("ejs", "reload"));
    gulp.watch("./source/**/*.js",  gulp.series("js", "reload"));
    gulp.watch("./source/**/*.scss",gulp.series("sass", "ejs", "reload"));
    done();
});

// scripts tasks
gulp.task('default',
    gulp.parallel('watch', 'server')
);
