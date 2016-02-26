var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass');
  //js = require('scripts');


gulp.task('sass', function () {
  gulp.src('./public/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src('./public/js/*.js')
  //  .pipe(jshint('.jshintrc'))
  //  .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('./public/js'))
   // .pipe(rename({suffix: '.min'}))
   // .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload());
  //  .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('img', function () {
  gulp.src('./public/img/*')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/img'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
  gulp.watch('./public/js/*.js', ['scripts']);
  gulp.watch('./public/img/*', ['img']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee handlebars',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'scripts',
  'develop',
  'watch'
]);
