var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    exec = require('child_process').exec,
    ngAnnotate = require("gulp-ng-annotate"),
    tsc = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    minifyCSS = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    typedoc = require("gulp-typedoc"),
    merge = require('merge-stream');
    tslint = require("gulp-tslint");


var paths = {
  ts: ['./js/**/*.ts', './js/templates/**/*.ts'],
  sass: ['./js/**/*.scss', './scss/**/*.scss']
};

gulp.task('default', ['sass', 'typescripts', 'typedoc', 'backupLayoutFiles']);
gulp.task('watchsass', ['sass', 'watchsass']);
gulp.task('watchreload', ['sass', 'browserSync', 'watch']);
gulp.task('doc', ['typedoc']);
gulp.task('dev', ['sass', 'typescripts']);

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ".",
      index: "index_debug.html"
    }
  });
});

gulp.task('backupLayoutFiles', function() {
    return gulp
        .src(['content/morfer.json', 'content/sessions.json', 'content/users.json'])
        .pipe(rename(function (path) {
            path.basename += '-backup';
        }))
        .pipe(gulp.dest('.')
    );
});


gulp.task('sass-new', function() {
    var sassStream,
        cssStream;

    sassStream = gulp.src(['./**/*.scss'])
        .pipe(sass({
            errLogToConsole: true
        }));

    cssStream = gulp.src('animate.css');

    //merge the two streams and concatenate their contents into a single file
    return merge(sassStream, cssStream)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(paths.public + 'css/'));
});

gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(sass({
        style: 'expanded'
      })
      .on('error', function(err){
        browserSync.notify(err.message, 10000);
        this.emit('end');
      })
      .on('error', sass.logError)
    )
    //.pipe(browserSync.reload({stream: true}))
    //.pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./css/'))
});

gulp.task('watchreload', function() {
  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('./css/main*.css').on('change', browserSync.reload);
  gulp.watch('./js/**/*.js').on('change', browserSync.reload);
  gulp.watch(['./partials/*.html', './js/components/*.html']).on('change', browserSync.reload);
});

gulp.task('watchsass', function() {
  gulp.watch('./scss/*.scss', ['visitrackersass']);
  gulp.watch('./js/controllers/*.scss', ['visitrackersass']);
  gulp.watch('./js/components/*.scss', ['visitrackersass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

// Compile to separate files
gulp.task('compile-separate', function () {
  return gulp.src('./js/**/*.ts', { base: "."})
    .pipe(tsc({
      target: 'ES5'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task("ts-lint", function() {
    return gulp.src(paths.ts)
        .pipe(tslint())
        .pipe(tslint.report("verbose"))
});


gulp.task("typescripts", function () {
  var tsResult = gulp
    .src(paths.ts)
    .pipe(sourcemaps.init())
    .pipe(tsc({
      module: "commonjs",
      target: "ES5",
      declarationFiles: false,
      emitDecoratorMetadata: true
    }));

  return tsResult.js
    .pipe(concat("MorfApp.bundle.js"))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./js"));

});

gulp.task("typedoc", function() {
  return gulp
    .src(["js/**/*.ts"])
    .pipe(typedoc({
      module: "commonjs",
      target: "es5",
      out: "docs/",
      name: "Morfologi"
    }))
    ;
});
