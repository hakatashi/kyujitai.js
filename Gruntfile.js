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
		mochaTest: {
			options: {
				reporter: 'spec'
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
					{src: 'data/kyujitai.json', dest: 'dev/kyujitai.json'},
					{src: 'node_modules/ivs/data/ivd.json', dest: 'dev/ivd.json'}
				]
			},
			dist: {
				files: [
					{src: 'data/kyujitai.json', dest: 'dist/kyujitai.json'},
					{src: 'node_modules/ivs/data/ivd.json', dest: 'dist/ivd.json'}
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
		},
		clean: {
			dev: ['dev'],
			dist: ['dist']
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['dev']);

	grunt.registerTask('build', ['data']);
	grunt.registerTask('dev', ['clean:dev', 'build', 'browserify:dev', 'copy:dev', 'uglify:dev']);
	grunt.registerTask('dist', ['clean:dist', 'build', 'browserify:dist', 'copy:dist', 'uglify:dist']);
	grunt.registerTask('test', ['dev', 'mochaTest']);

	grunt.registerTask('pages', ['less']);
	grunt.registerTask('serve', ['pages', 'watch']);

	grunt.registerTask('data', 'build kyujitai.json', function () {
		var done = this.async();
		var CSON = require('cson');
		var fs = require('fs');
		var data = {
			douon: CSON.parseCSONFile('data/douon.cson'),
			kyuji: CSON.parseCSONFile('data/kyuji.cson'),
			exclude: CSON.parseCSONFile('data/exclude.cson')
		};

		fs.writeFile('data/kyujitai.json', JSON.stringify(data), done);
		grunt.log.writeln('created data/kyujitai.json');
	});
};
