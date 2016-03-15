'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', () => {
	return gulp.src('./*.scss')
		.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'))
    .pipe(reload({stream: true}));
	});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: './'  
  })
});

gulp.task('watch', () => {
	gulp.watch('./*.scss', ['styles']);
	gulp.watch('./*.js', ['scripts']);
	gulp.watch('./*.html', reload);
	});

gulp.task('scripts', () => {
	gulp.src('./script.js')
			.pipe(sourcemaps.init())
	    .pipe(babel({
	      presets: ['es2015']
	    }))
	    .pipe(sourcemaps.write('.'))
	    .pipe(gulp.dest('./'))
	    .pipe(reload({stream: true}));
	});

gulp.task('default', ['browser-sync','styles', 'scripts', 'watch']);
