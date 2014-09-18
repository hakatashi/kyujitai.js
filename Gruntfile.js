module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			options: {
				ignore: ['zlib']
			},
			dev: {
				src: ['lib/browser.js'],
				dest: 'dev/kyujitai.js'
			},
			dist: {
				src: ['lib/browser.js'],
				dest: 'dist/kyujitai.js'
			},
		},
		compress: {
			data: {
				options: {
					mode: 'gzip'
				},
				src: ['data/kyujitai.json'],
				dest: 'lib/kyujitai.json.gz'
			}
		},
		mochaTest: {
			options: {
				reporter: 'nyan'
			},
			src: ['test/**/*.js']
		},
		uglify: {
			dev: {
				src: 'dev/kyujitai.js',
				dest: 'dev/kyujitai.min.js'
			},
			dist: {
				src: 'dist/kyujitai.js',
				dest: 'dist/kyujitai.min.js'
			}
		},
		copy: {
			dev: {
				files: [
					{src: 'lib/kyujitai.json.gz', dest: 'dev/kyujitai.json.gz'},
					{src: 'node_modules/ivs/data/IVD.json.gz', dest: 'dev/IVD.json.gz'}
				]
			},
			dist: {
				files: [
					{src: 'lib/kyujitai.json.gz', dest: 'dist/kyujitai.json.gz'},
					{src: 'node_modules/ivs/data/IVD.json.gz', dest: 'dist/IVD.json.gz'}
				]
			}
		},
		less: {
			pages: {
				options: {
					paths: ['assets/css']
				},
				files: {
					'assets/css/style.css': 'assets/css/style.less'
				}
			}
		},
		watch: {
			less: {
				files: ['**/*.less'],
				tasks: ['less']
			},
			livereload: {
				files: ['**/*.html', 'assets/**/*'],
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', ['dev']);

	grunt.registerTask('build', ['data', 'compress:data']);
	grunt.registerTask('dev', ['build', 'browserify:dev', 'copy:dev', 'uglify:dev']);
	grunt.registerTask('dist', ['build', 'browserify:dist', 'copy:dist', 'uglify:dist']);
	grunt.registerTask('test', ['dev', 'mochaTest']);

	grunt.registerTask('pages', ['less']);
	grunt.registerTask('serve', ['pages', 'watch']);

	grunt.registerTask('data', 'build kyujitai.json', function () {
		var done = this.async();
		var CSON = require('cson');
		var fs = require('fs');
		var data = {
			douon: CSON.parseFileSync('data/douon.cson'),
			kyuji: CSON.parseFileSync('data/kyuji.cson')
		};

		fs.writeFile('data/kyujitai.json', JSON.stringify(data), done);
	});
};
