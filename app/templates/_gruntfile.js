module.exports = function(grunt) {
    var globalConfig = {
        source: './source',
        build: './build/source'
    };

    grunt.initConfig({
        pkg: require('./package.json'),
        globalConfig: globalConfig,
        clean: {
            build: [
                'build'
            ]
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['<%= globalConfig.source %>/**','!source/index.html'],
                    dest: 'build/'
                }]
            },
        },
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= globalConfig.source %>/images/',
                        src: ['**/*.png'],
                        dest: '<%= globalConfig.build %>/images/',
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
                        cwd: '<%= globalConfig.source %>/images/',
                        src: ['**/*.jpg'],
                        dest: '<%= globalConfig.build %>/images/',
                        ext: '.jpg'
                    }
                ]
            }
        },
        compress: {
          main: {
            options: {
              archive: 'dist/<%= pkg.name %>-build_'+grunt.template.today('ddmmHHMM')+'.zip'
            },
            files: [
                {expand: true, cwd: '<%= globalConfig.build %>', src: ['**'], dest: '<%= pkg.name %>/'}, // makes all src relative to cwd
            ]
          }
        },
        inlinecss: {
            main: {
                options: {
                },
                files: {
                    '<%= globalConfig.source %>/index-inline.html': '<%= globalConfig.source %>/index.html'
                }
            }
        },
        watch: {
            files: ['<%= globalConfig.source %>/index.html'],
            tasks: ['inlinecss'],
        },
        'string-replace': {
            dist: {
                files: {
                  '<%= globalConfig.source %>/index-inline.html': '<%= globalConfig.source %>/index-inline.html'
                },
                options: {
                  replacements: [{
                    pattern: 'http://projects.loadedcommunications.com.au/<%= pkg.name %>',
                    replacement: ''
                  }]
                }
            }               
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-inline-css');
    grunt.loadNpmTasks('grunt-string-replace');

    // Default task.
    grunt.registerTask('default', ['inlinecss','watch']);

    // Build for delivery
    grunt.registerTask('build', ['clean','inlinecss', 'string-replace', 'copy', 'imagemin', 'compress']);    
};