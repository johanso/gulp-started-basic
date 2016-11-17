
 /* ======================================================================================================
 * Plugins utilizados
 * ======================================================================================================*/
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();

 /* ======================================================================================================
 * Tarea sobre los Syilos
 * ======================================================================================================*/
gulp.task('styles', function () {
    gulp.src("./src/scss/*.scss")
    .pipe(sass()).on('error', notify.onError(function (error) {
       return 'Error al compilar sass.\n Detalles en la consola.\n' + error;
    }))
   .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
   .pipe(gulp.dest("./dist/css/"))
   .pipe(notify({ title: "SASS", message: "OK: Archivo compilado" }))
   .pipe(browserSync.stream());
});

 /* ======================================================================================================
 * Tarea sobre los Scripts
 * ======================================================================================================*/
gulp.task('scripts', function() {
    return gulp.src('./src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
});

 /* ======================================================================================================
 * Tarea por default
 * ======================================================================================================*/
gulp.task('default', function () {
    browserSync.init({
        injectChanges: true,
        "files": ['*.html', './dist/**/*.{html,css,js}'],
        server: "./",
    });
    gulp.watch('./src/scss/*.scss', ['styles']); // Vigila cambios en los estilos
    gulp.watch('./src/js/*.js', ['scripts']);
});
