module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			dev: {
				src: ['lib/index.js'],
				dest: 'dev/kyujitai.js'
			},
			dist: {
				src: ['lib/index.js'],
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
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['dev']);

	grunt.registerTask('build', ['data', 'compress:data']);
	grunt.registerTask('dev', ['build', 'browserify:dev']);
	grunt.registerTask('dist', ['build', 'browserify:dist']);
	grunt.registerTask('test', ['build', 'mochaTest']);

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
