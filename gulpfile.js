
const

   // modules
   gulp = require('gulp'),
   server = require('gulp-webserver');
   newer = require('gulp-newer'),
   noop = require('gulp-noop'),
   imagemin = require('gulp-imagemin'),
   htmlclean = require('gulp-htmlclean'),
   concat = require('gulp-concat'),
   deporder = require('gulp-deporder'),
   terser = require('gulp-terser'),
   stripdebug = require('gulp-strip-debug'),
   sourcemaps = require('gulp-sourcemaps'),
   sass = require('gulp-sass'),
   postcss = require('gulp-postcss'),
   assets = require('postcss-assets'),
   autoprefixer = require('autoprefixer'),
   mqpacker = require('css-mqpacker'),
   cssnano = require('cssnano'),
   
   // folders
   src = 'src/',
   build = 'build/'
;

/**********************************
 * IMAGE PROCESSING
***********************************/
function images() {
   const out = build + 'images/';
   return gulp.src(src + 'images/**/*')
   .pipe(newer(out))
   .pipe(imagemin({ optimizationLevel: 5 }))
   .pipe(gulp.dest(out));
}; exports.images = images;


/**********************************
 * HTML PROCESSING
***********************************/
function html() {
   const out = build + '/';
 
   return gulp.src(src + 'html/**/*')
   .pipe(newer(out))
   .pipe(htmlclean())
   .pipe(gulp.dest(out));
}; exports.html = gulp.series(images, html);


/**********************************
 * JAVASCRIPT PROCESSING
***********************************/
function js() {
   return gulp.src(src + 'js/**/*')
   .pipe(sourcemaps ? sourcemaps.init() : noop())
   .pipe(deporder())
   .pipe(concat('main.js'))
   .pipe(stripdebug ? stripdebug() : noop())
   .pipe(terser())
   .pipe(sourcemaps ? sourcemaps.write() : noop())
   .pipe(gulp.dest(build + 'js/'));
 
} exports.js = js;


/**********************************
 * CSS PROCESSING
***********************************/
function css() {
   return gulp.src(src + 'scss/main.scss')
   .pipe(sourcemaps ? sourcemaps.init() : noop())
   .pipe(sass({
      outputStyle: 'nested',
      imagePath: '/images/',
      precision: 3,
      errLogToConsole: true
   }).on('error', sass.logError))
   .pipe(postcss([
      assets({ loadPaths: ['images/'] }),
      autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
      mqpacker,
      cssnano
   ]))
   .pipe(sourcemaps ? sourcemaps.write() : noop())
   .pipe(gulp.dest(build + 'css/'));
 
 }
 exports.css = gulp.series(images, css);


/**********************************
 * WATCH FOR FILE CHANGE
***********************************/
function watch(done) {
   gulp.watch(src + 'images/**/*', images);
   gulp.watch(src + 'html/**/*', html);
   gulp.watch(src + 'scss/**/*', css);
   gulp.watch(src + 'js/**/*', js);
   done();
 }
 exports.watch = watch;


/**********************************
 * LOCAL SERVER
***********************************/
gulp.task('server', function() {
gulp.src('build')
   .pipe(server({
      fallback: 'index.html',
      livereload: true,
      open: true,
      port: 8000	// set a port to avoid conflicts with other local apps
   }));
});

/**********************************
 * TASK FOR RUN ALL TASK
***********************************/
exports.build = gulp.parallel(exports.html, exports.css, exports.js);

exports.default = gulp.series(exports.build, exports.watch, ['server']);
// Execute gulp for run all task include watch
