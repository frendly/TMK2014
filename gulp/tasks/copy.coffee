gulp    = require 'gulp'
changed = require 'gulp-changed'
filter  = require 'gulp-filter'
gutil   = require 'gulp-util'
gulpif  = require 'gulp-if'
paths   = require '../paths'


gulp.task 'copy:images', ->
	gulp.src [
			'**/*.{png,jpg,gif}'
			'!sprite/**/*'
		],
			cwd: paths.appImages
		.pipe gulp.dest paths.images

gulp.task 'copy:resources', ->
	gulp.src [
		'app/resources/**/*'
		'app/resources/.htaccess'
	]
		.pipe changed paths.dist
		.pipe gulpif !gutil.env.robots, filter (file) ->
			!/app[\\\/]resources[\\\/]robots\.txt/.test file.path
		.pipe gulp.dest paths.dist

gulp.task 'copy:scripts', ->
	gulp.src ['**/*.js'],
			base: 'app/scripts'
			cwd: 'app/scripts'
		.pipe changed paths.scripts
		.pipe gulp.dest paths.scripts

gulp.task 'copy:components', ->
	gulp.src [
			'jquery/dist/jquery.min.js'
			'fotorama/*.{js,png}'
			'fancybox/source/*'
			'jquery-sticky/jquery.sticky.js'
			'cookies-js/dist/cookies.min.js'
			'jquery-pjax/jquery.pjax.js'

		],
			base: 'components'
			cwd: 'components'
		.pipe changed paths.scripts
		.pipe gulp.dest paths.scripts + '/libs'

gulp.task 'copy', [
		'copy:components',
		'copy:images',
		'copy:resources',
		'copy:scripts'
	]
