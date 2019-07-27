const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const errorHandler = r => {
    notify.onError('\n\n❌  ===> ERROR: <%= error.message %>\n')(r);
};

gulp.task('assets', function () {
    return gulp.src('./app/assets/**/*').pipe(gulp.dest('./dist/assets/'));
});

gulp.task('scripts', function () {
    return gulp
        .src('app/js/app.js')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(plumber(errorHandler))
        .pipe(
            babel({
                presets: ['env']
            })
        )
        .pipe(browserify())
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function () {
    return gulp
        .src('./app/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber(() => { notify.onError('\n\n❌  ===> SASS ERROR %>\n') }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('index', function () {
    return gulp
        .src('./app/index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('serve', gulp.series('sass', 'scripts', 'assets', 'index', function () {
    browserSync.init({
        server: './dist',
        open: true
    });
    gulp.watch('app/scss/**/*', gulp.series('sass'));
    gulp.watch('app/js/*.js', gulp.series('scripts'));
    gulp.watch('app/assets/**/*', gulp.series('assets'));
    gulp.watch('app/index.html', gulp.series('index'));
    gulp.watch('dist/*.html').on('change', browserSync.reload);
    gulp.watch('dist/js/*.js').on('change', browserSync.reload);
}));

gulp.task('build', gulp.series('sass', 'scripts', 'assets', 'index'));
gulp.task('default', gulp.series('serve'));