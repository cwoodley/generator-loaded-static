module.exports = function(grunt) {
		var globalConfig = {
				source: './source',
				build: './build/source',
				assets: './source/assets'
		};

		require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);    

		grunt.initConfig({
			pkg: require('./package.json'),
			globalConfig: globalConfig,
			// local webserver
			express: {
				all: {
					options: {
						port: 9000,
						hostname: "*",
						bases: ['<%%= globalConfig.source %>'],
						livereload: true
					}
				}
			},
			bake: {
		    build: {
	        options: {
            // Task-specific options go here.
	        },
	        files: {
            // files go here, like so:
            "source/index.html": "source/templates/_index.html",
	        }
		    },
			},
			// compile CSS from SCSS files
			sass: {
				dist: {
					options: {
						style: 'compressed'
					},
					files: {
						'<%%= globalConfig.assets %>/stylesheets/css/<%%=pkg.name %>.css': '<%%= globalConfig.assets %>/stylesheets/sass/<%%=pkg.name %>.scss'
					}
				},
				dev: {
					options: {
						style: 'expanded',
						debugInfo: true,
						lineNumbers: true,
					},
					files: {
						'<%%= globalConfig.assets %>/stylesheets/css/<%%=pkg.name %>.css': '<%%= globalConfig.assets %>/stylesheets/sass/<%%=pkg.name %>.scss'
					}
				}
			},    
			// watch for file changes and reload browser windows 
			watch: {
				all: {
					files: '<%%= globalConfig.source %>/index.html',
					options: {
						livereload: true,
						spawn: false
					}
			 	},
		    bake: {
		        files: [ "<%%= globalConfig.source %>/includes/**" ],
		        tasks: "bake:build"
		    },
				js: {
					files: ['<%%= globalConfig.assets %>/javascripts/*.js'],
					tasks: ['concat:js'],
					options: {
						livereload: true,
						spawn: false
					}
				},
				css: {
					files: ['<%%=globalConfig.assets %>/stylesheets/sass/*.scss'],
					tasks: ['sass:dev'],
					options: {
						livereload: true,
						spawn: false
					}
				}
			},
			// open your browser at the project's URL
			open: {
				all: {
					path: 'http://localhost:<%%= express.all.options.port%>',
					app: "<%= devBrowser %>"
				}
			},   
			// clear out build directory
			clean: {
				build: [
					'build'
				]
			},
			// copy project files to build dir
			copy: {
				main: {
					files: [{
						expand: true,
						src: [
							'<%%= globalConfig.source %>/**',
							'!<%%=globalConfig.assets %>/stylesheets/sass/**',
							'!<%%=globalConfig.assets %>/images/sprites/**',
							'!<%%=globalConfig.assets %>/vendor/*.js',
						],
						dest: 'build/'
					}]
				},
			},
			// compress compiled CSS
			cssmin: {
				production: {
						expand: true,
						cwd: '<%%=globalConfig.assets %>/stylesheets/css',
						src: ['*.css'],
						dest: '<%%=globalConfig.assets %>/stylesheets/css'
				}
			},
			// compress images
			imagemin: {
				png: {
					options: {
						optimizationLevel: 7
					},
					files: [
						{
							expand: true,
							cwd: '<%%=globalConfig.assets %>/images/',
							src: ['**/*.png'],
							dest: '<%%=globalConfig.assets %>/images/',
							ext: '.png'
						}
					]
				},
				jpg: {
					options: {
						progressive: true
					},
					files: [
						{
							expand: true,
							cwd: '<%%=globalConfig.assets %>/images/',
							src: ['**/*.jpg', '!**/sprites/**'],
							dest: '<%%= globalConfig.build %>/assets/images/',
							ext: '.jpg'
						}
					]
				}
			},
			// merge all vendor scripts into one file
			concat: {
				js: {
					options: {
							separator: ';'
					},
					src: [
							'<%%=globalConfig.assets %>/vendor/*.js'
					],
					dest: '<%%=globalConfig.assets %>/javascripts/<%%= pkg.name %>.vendor.min.js'
				},
			},
			// compress merged vendor scripts file
			uglify: {
				options: {
					mangle: false
				},
				js: {
					files: {
					'<%%=globalConfig.assets %>/javascripts/<%%= pkg.name %>.vendor.min.js': ['<%%=globalConfig.assets %>/javascripts/<%%= pkg.name %>.vendor.min.js']
					}
				}
			},
			// create a deliverable zip file of built project
			compress: {
				main: {
					options: {
						archive: 'dist/<%%=pkg.name %>-build_'+grunt.template.today('ddmmHHMM')+'.zip'
					},
					files: [
						{
							expand: true,
							cwd: '<%%= globalConfig.build %>',
							src: ['**'],
							dest: '<%%= pkg.name %>/'
						} // makes all src relative to cwd
					]
				}
			},		        
			sprite:{
				all: {
					engine: 'gm',
					engineOpts: {
						'imagemagick': true
					},	      
					algorithm: 'alt-diagonal',
					src: '<%%=globalConfig.assets %>/images/sprites/*.png',
					destImg: '<%%=globalConfig.assets %>/images/spritesheet.png',
					destCSS: '<%%=globalConfig.assets %>/stylesheets/sass/_spritesheet.scss',
					cssOpts: {
						// Some templates allow for skipping of function declarations
						functions: true,

						// CSS template allows for overriding of CSS selectors
						// cssClass: function (item) {
						//   return '.bottle-' + item.name;
						// }
					}
				}
			},
			processhtml: {
				dist: {
					files: {
						'<%%= globalConfig.build %>/index.html': ['<%%= globalConfig.source %>/index.html']
					}
				}
			}	 			    
		});

		grunt.event.on('watch', function(action, filepath, target) {
			grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
		});

		// Creates the `server` task
		grunt.registerTask('server', [
			'express',
			'bake:build',
			'sass:dev',
			'watch'
		]);

		// Default task.
		grunt.registerTask('default', ['server']);

		// Build for checking
		grunt.registerTask('nozip', ['clean','bake:build','sass:dist','concat','uglify','copy','processhtml',]);    

		// Build for delivery
		grunt.registerTask('build', ['nozip','compress']);   
};