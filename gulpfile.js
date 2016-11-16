var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();



gulp.task('styles', function () {
    gulp.src("./src/scss/style.scss") // Consigue la ubicación de los archivos
   .pipe(sass().on('error', sass.logError)) // Notificaciones de error
   .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false })) // Autoprefijar propiedades CSS
   .pipe(gulp.dest("./dist/css/")) // Guarda los archivos ya procesados
   // Notificaciones confirmando el proceso
   .pipe(notify({
      title: "SASS",
      message: "OK: Archivo compilado" // Mensaje a mostrar
   }))
   .pipe(browserSync.stream()); // Recarga el navegador web cuando termina el proceso de estilos
});


gulp.task('default', function () {
   browserSync.init({
       server: "./", // Lift current folder web server
   });
  gulp.watch('src/scss/*.scss', ['styles']); // Vigila cambios en los estilos
  gulp.watch("*.html").on("change", browserSync.reload); //  Recarga en cambios de los HTML
});
