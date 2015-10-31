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
			'components/jquery/dist/jquery.min.js'
			'components/fotorama/fotorama.js'
			'components/fancybox/source/jquery.fancybox.pack.js'
			'components/jquery-sticky/jquery.sticky.js'
			'components/cookies-js/dist/cookies.min.js'
			'components/jquery-pjax/jquery.pjax.js'

			'app/scripts/activeMenuItem.js'
			'app/scripts/submenu.js'
			'app/scripts/breadcrumb.js'

			'app/scripts/formSubmit.js'
			'app/scripts/accordion.js'
			'app/scripts/lightbox.js'
			'app/scripts/printPage.js'
			'app/scripts/prevNextLink.js'


			'app/scripts/counterCookieItems.js'
			'app/scripts/checkAll.js'
			'app/scripts/myreport.js'

			'app/scripts/common.js'
		]
		.pipe plumber errorHandler: errorHandler
		.pipe concat 'common.min.js'
		.pipe gulpif !gutil.env.debug, uglify()
		.pipe gulp.dest paths.scripts
