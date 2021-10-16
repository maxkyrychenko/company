const {src, dest, watch, parallel, series} = require('gulp')

const scss = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const fonter = require('gulp-fonter')
const del = require('del')
const fileInclude = require('gulp-file-include')
const webpackStream = require('webpack-stream')
const fs = require('fs')

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'src/'
		},
		notify: false
	})
}

function cleanApp() {
	return del('app')
}

function html() {
	return src('src/_global.html')
		.pipe(fileInclude())
		.pipe(concat('index.html'))
		.pipe(dest('src'))
		.pipe(browserSync.stream())
}

function images() {
	return src('src/images/**/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			interlaced: true,
			optimizationLevel: 3 // 0 to 7
		}))
		.pipe(dest('app/images'))
}

function fonts() {
	src('src/fonts/**/*')
		.pipe(ttf2woff())
		.pipe(dest('src/fonts'))
	return src('src/fonts/**/*')
		.pipe(ttf2woff2())
		.pipe(dest('src/fonts'))
}

function fontsConverter() {
	return src('src/fonts/*.{otf,eot}')
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest('src/fonts'))
}

function scripts() {
	return src('src/js/main.js')
		.pipe(webpackStream({
			output: {
				filename: 'main.min.js'
			},
			mode: 'development',
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /node_modules/,
						use: [
							{
								loader: 'babel-loader',
								options: {
									presets: [
										['@babel/preset-env', {
											"targets": "> 0.25%, not dead"
										}]
									]
								}
							}
						]
					},
				]
			}
		}))
		.pipe(uglify())
		.pipe(dest('app/js/'))
		.pipe(browserSync.stream())
}

function scriptsBuild() {
	return src('src/js/main.js')
		.pipe(webpackStream({
			output: {
				filename: 'main.min.js'
			},
			mode: 'production',
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									['@babel/preset-env']
								]
							}
						}
					}
				]
			}
		}))
		.pipe(uglify())
		.pipe(dest('app/js/'))
}

function styles() {
	return src('src/scss/main.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			cascade: false,
			grid: true
		}))
		.pipe(dest('src/css'))
	.pipe(browserSync.stream())
		.pipe(scss({outputStyle: 'expanded'}))
		.pipe(concat('style.css'))
		.pipe(dest('src/css'))
}

function build() {
	return src([
		'src/css/style.min.css',
		'src/fonts/**/*.{woff,woff2}',
		'src/js/main.min.js',
		'src/*.html', 
		'!src/_*.html',
	], {base: 'src'})
		.pipe(dest('app'))
}

function watching() {
	watch('src/scss/**/*.scss', styles)
	watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts)
	watch(['src/*.html', '!src/index.html'], html)
}

function fontsStyle(cb) {
	let file_content = fs.readFileSync('src/scss/utils/fonts.scss');
		if (file_content == '') {
			fs.writeFile('src/scss/utils/fonts.scss', '', cb);
			return fs.readdir('app/fonts', function (err, items) {
			if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
			let fontname = items[i].split('.');
			fontname = fontname[0];
			if (c_fontname != fontname) {
			fs.appendFile('src/scss/utils/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
			}
			c_fontname = fontname;
			}
			}
			})
		}
		cb()
}

exports.styles = styles
exports.watching = watching
exports.scripts = scripts
exports.cleanApp = cleanApp
exports.images = images
exports.fontsConverter = fontsConverter
exports.fonts = fonts
exports.fontsStyle = fontsStyle
exports.html = html
exports.browsersync = browsersync

exports.build = series(cleanApp, images, build, scriptsBuild)
exports.fonts = series(fontsConverter, fonts, fontsStyle)
exports.default = parallel(browsersync, watching, scripts, styles, images, html)