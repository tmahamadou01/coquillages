module.exports = function(grunt) {

	require('time-grunt')(grunt); // Displays the elapsed execution time of tasks
	require('jit-grunt')(grunt);  // JIT (Just In Time) plugin loader


	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		// Concatenation /////////////////////////////////////////////////////////
		concat: {
			scripts: {
				src: ['js/_scripts/*.js', 'js/*.js'],
				dest: 'js/dev/scripts.js',
			},
			polyfills: {
				src: ['js/_polyfills/*.js'],
				dest: 'js/dev/polyfills.js',
			},
			css: {
				src: ['css/*.scss'],
				dest: 'css/temp/main.scss',
			}
		},


		// CSS processing ////////////////////////////////////////////////////////
		sass: {
	        options: {
	            indentedSyntax: true,
	            indentType: 'tab',
	            indentWidth: 1
	        },
	        target: { files: { 'css/dev/main.css': 'css/global.scss' } }
    	},

		autoprefixer: {
			options: { browsers: ['last 5 versions', 'Opera >= 12', 'ie >= 9'] },
			target: { files: { 'css/dist/main.min.css': 'css/dev/main.css' } },
		},

		cssnano: {
	        options: {  // http://cssnano.co/optimisations/
	            sourcemap: false,
	            autoprefixer: false,
				calc: false,
				colormin: true,
				convertValues: true,
				discardComments: true,
				discardDuplicates: true,
				discardEmpty: true,
				discardUnused: true,
				filterPlugins: true,
				functionOptimiser: true,
				mergeIdents: true,
				mergeLonghand: true,
				mergeRules: false,
				minifyFontValues: true,
				minifySelectors: true,
				normalizeUrl: true,
				orderedValues: true,
				reduceIdents: true,
				singleCharset: false,
				uniqueSelectors: true,
				zindex: true,
	        },
	        target: { files: { 'css/dist/main.min.css': 'css/dist/main.min.css' } }
    	},


		// JS minifcation ////////////////////////////////////////////////////////
		uglify: {
			scripts: { files: { 'js/dist/scripts.min.js': 'js/dev/scripts.js' } },
			polyfills: { files: { 'js/dist/polyfills.min.js': 'js/dev/polyfills.js' } }
		},


		// HTML processing ///////////////////////////////////////////////////////
		jade: {
			compile: {
				options: { pretty: false },
				files: { 'index.html': ['src/*.jade'] }
			}
		},


		// Clean /////////////////////////////////////////////////////////////////
		clean: ["js/dev/*", "js/dist/*", "css/dev/*", "css/dist/*", "css/temp/*"],


		// Monitoring ////////////////////////////////////////////////////////////
		watch: {
			scripts: {
				files: ['js/_scripts/*.js', 'js/*.js'],
				tasks: ['concat:scripts']
			},
			polyfills: {
				files: ['js/_polyfills/*.js'],
				tasks: ['concat:polyfills']
			},
			html: {
				files: ['src/**/*.jade', 'src/**/*.html'],
				tasks: ['jade']
			},
			css: {
				files: ['css/*.scss'],
				tasks: ['sass']
			}
		}
	});

	// Tasks
	grunt.registerTask('default', ['clean', 'concat', 'uglify', 'sass', 'autoprefixer', 'cssnano', 'jade', 'watch']);

};