gulp         = require 'gulp'
plumber      = require 'gulp-plumber'
gutil        = require 'gulp-util'
gulpif       = require 'gulp-if'
concat       = require 'gulp-concat'
uglify       = require 'gulp-uglify'
errorHandler = require '../utils/errorHandler'
paths        = require '../paths'

gulp.task 'scripts', ->
	gulp.src [
			'components/jquery/dist/jquery.js'
			'components/cookies-js/dist/cookies.js'
			'components/fotorama/fotorama.js'
			'components/simplelightbox/dist/simple-lightbox.min.js'
			'components/blurjs/dist/jquery.blur.js',
			'components/fancybox/source/jquery.fancybox.pack.js',
			'app/scripts/common.js'
		]
		.pipe plumber errorHandler: errorHandler
		.pipe concat 'common.min.js'
		.pipe gulpif !gutil.env.debug, uglify()
		.pipe gulp.dest paths.scripts
