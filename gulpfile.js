var gulp = require('gulp');
var watch = require('gulp-watch');
var prefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-minify-css');
var rimraf = require('rimraf');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gutil = require('gulp-util');
var imgRetina = require('gulp-img-retina');

var path = {
	dist: {
		html: 'dist/',
		style: 'dist/css/',
		js: 'dist/js/',
		images: 'dist/images/',
		assets: 'dist/assets'
	},
	src: {
		html: 'src/*.html',
		style: 'src/scss/main.scss',
		js: 'src/js/main.js',
		images: 'src/images/**/*.*',
		assets: 'assets/**/*.*',
		svg: 'src/images/icons/*.svg'
	},
	watch: {
		html: 'src/**/*.html',
		style: 'src/scss/**/*.scss',
		js: 'src/js/**/*.js',
		images: 'src/images/**/*.*',
		assets: 'assets/**/*.*',
		svg: 'src/images/icons/*.svg'
	},
	clean: './dist'
};

var config = {
	server: {
		baseDir: "./dist"
	},
	tunnel: false,
	host: 'localhost',
	port: 3000,
	open: false,
	logPrefix: "Forgrant"
};

gulp.task('html:build', function () {
	return gulp.src(path.src.html)
    .pipe(imgRetina())
		.pipe(gulp.dest(path.dist.html))
		.pipe(reload({ stream: true }))
		.on('error', gutil.log)
});

gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.dist.style))
		.pipe(reload({ stream: true }))
		.on('error', gutil.log)
});

gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.dist.js))
		.pipe(reload({ stream: true }))
		.on('error', gutil.log)
});

gulp.task('image:build', function () {
	return gulp.src(path.src.images)
		.pipe(gulp.dest(path.dist.images))
		.pipe(reload({stream: true}))
		.on('error', gutil.log)
});

gulp.task('assets:build', function () {
	return gulp.src(path.src.assets)
		.pipe(gulp.dest(path.dist.assets))
		.pipe(reload({ stream: true }))
		.on('error', gutil.log)
});

gulp.task('build', [
	'html:build',
	'style:build',
	'js:build',
	'image:build',
	'assets:build'
]);

gulp.task('watch', function() {
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.images], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.assets], function(event, cb) {
		gulp.start('assets:build');
	});

});

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);