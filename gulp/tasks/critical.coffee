gulp     = require 'gulp';
critical = require 'critical'
paths    = require '../paths'

gulp.task 'critical', ->
	gulp.src ['02.html'], cwd: 'dist/'
		.pipe critical.stream
			base: 'dist/'
			inline: true
			css: 'dist/assets/styles/common.css'
			width: 1300
			height: 900
		.pipe gulp.dest paths.dist
