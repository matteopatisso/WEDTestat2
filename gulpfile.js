// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var supervisor = require('gulp-supervisor');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('public/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('public/scss/main.sass')
        .pipe(sass())
        .pipe(gulp.dest('public/css'));
});

gulp.task('supervisor', function () {
    supervisor( "app.js" );
});


// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('public/js/*.js', ['lint']);
    gulp.watch('public/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', [/*'lint', */'sass', 'watch', 'supervisor']);