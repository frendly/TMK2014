runSequence = require 'run-sequence'
gulp        = require 'gulp'
gutil       = require 'gulp-util'

gulp.task 'stylusDependences', ->
	runSequence(
		'spritesmith'
		'stylus'
	)

gulp.task 'jade', ->
	runSequence([
		'jade-ru'
		'jade-en'
	])

gulp.task 'default', ->
	runSequence(
		[
			'stylusDependences'
			'scripts'
			'jscs'
			'jshint'
		]
		'browserSync'
		'watch'
		->
			if gutil.env.ngrok
				gulp.start 'ngrok'
	)

gulp.task 'build', ['del'], ->
	gulp.start(
		'stylusDependences'
		'jade'
		'scripts'
		'copy'
	)

gulp.task 'build-ru', ['del'], ->
	gulp.start(
		'stylusDependences'
		'jade-ru'
		'scripts'
		'copy'
	)

gulp.task 'build-en', ['del'], ->
	gulp.start(
		'stylusDependences'
		'jade-en'
		'scripts'
		'copy'
	)

gulp.task 'deploy', ->
	runSequence(
		'del'
		'build'
		'ghpages'
	)
