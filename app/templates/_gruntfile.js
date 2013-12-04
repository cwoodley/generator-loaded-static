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
    // grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
        express: {
          all: {
            options: {
              port: 9000,
              hostname: "0.0.0.0",
              bases: ['<%%= globalConfig.source %>'],
              livereload: true
            }
          }
        },
     
        // grunt-watch will monitor the projects files
        watch: {
          all: {
            // Replace with whatever file you want to trigger the update from
            // Either as a String for a single entry 
            // or an Array of String for multiple entries
            // You can use globing patterns like `css/**/*.css`
            // See https://github.com/gruntjs/grunt-contrib-watch#files
            files: '<%%= globalConfig.source %>/index.html',
            options: {
              livereload: true
            }
         }
         //  ,
         // js: {
         //    files: ['<%%= globalConfig.assets %>/javascripts/*.js'],
         //    tasks: ['concat:js', 'uglify:js'],
         //    options: {
         //      livereload: true,
         //    }
         //  },
         //  css: {
         //    files: ['<%%= globalConfig.assets %>/sass/*.*'],
         //    tasks: ['sass:style'],
         //    options: {
         //      livereload: true,
         //    }
         //  }

        },
     
        // grunt-open will open your browser at the project's URL
        open: {
          all: {
            // Gets the port from the connect configuration
            path: 'http://localhost:<%%= express.all.options.port%>'
            app: "<%= devBrowser %>"
          }
        },   
        clean: {
            build: [
                'build'
            ]
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['<%%= globalConfig.source %>/**','!sass/**'],
                    dest: 'build/'
                }]
            },
        },
        cssmin: {
            production: {
                expand: true,
                cwd: '<%%=globalConfig.assets %>/stylesheets/css',
                src: ['*.css'],
                dest: '<%%=globalConfig.assets %>/stylesheets/css'
            }
        },
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
                        dest: '<%%= globalConfig.build %>/assets/images/',
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
                        cwd: '<%%= globalConfig.assets %>/images/',
                        src: ['**/*.jpg'],
                        dest: '<%%= globalConfig.build %>/assets/images/',
                        ext: '.jpg'
                    }
                ]
            }
        },
        // concat: {
        //     js: {
        //         options: {
        //             separator: ';'
        //         },
        //         src: [
        //             '<%%= globalConfig.assets %>/javascripts/*.js'
        //         ],
        //         dest: '<%%= globalConfig.assets %>/javascripts/<%%= pkg.name %>.min.js'
        //     },
        // },
        // uglify: {
        //   options: {
        //     mangle: false
        //   },
        //   js: {
        //     files: {
        //       '<%%= globalConfig.assets %>/javascripts/<%%= pkg.name %>.min.js': ['<%%= globalConfig.assets %>/javascripts/<%%= pkg.name %>.min.js']
        //     }
        //   }
        // },

        compress: {
          main: {
            options: {
              archive: 'dist/<%%=pkg.name %>-build_'+grunt.template.today('ddmmHHMM')+'.zip'
            },
            files: [
                {expand: true, cwd: '<%%= globalConfig.build %>', src: ['**'], dest: '<%%= pkg.name %>/'}, // makes all src relative to cwd
            ]
          }
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

      // Creates the `server` task
      grunt.registerTask('server', [
        'express',
        'open',
        'watch'
      ]);

    // Default task.
    grunt.registerTask('default', ['watch']);

    // Build for checking
    grunt.registerTask('nozip', ['clean','copy', 'imagemin']);    

    // Build for delivery
    grunt.registerTask('build', ['clean','copy', 'imagemin', 'compress']);    
};