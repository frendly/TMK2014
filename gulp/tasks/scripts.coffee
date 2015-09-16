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
			'components/fancybox/source/jquery.fancybox.pack.js',
			'components/jquery-sticky/jquery.sticky.js'
			'app/scripts/common.js'
		]
		.pipe plumber errorHandler: errorHandler
		.pipe concat 'common.min.js'
		.pipe gulpif !gutil.env.debug, uglify()
		.pipe gulp.dest paths.scripts
