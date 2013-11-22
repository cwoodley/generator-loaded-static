module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            build: [
                'build'
            ]
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['source/**'],
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
                        cwd: './source/images/',
                        src: ['**/*.png'],
                        dest: './build/source/images/',
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
                        cwd: './source/images/',
                        src: ['**/*.jpg'],
                        dest: './build/source/images/',
                        ext: '.jpg'
                    }
                ]
            }
        },
        compress: {
          main: {
            options: {
              archive: 'dist/<%= _.slugify(projectName) %>-build_'+grunt.template.today('ddmmHHMM')+'.zip'
            },
            files: [
                {expand: true, cwd: './build/source/', src: ['**'], dest: '<%= _.slugify(projectName) %>/'}, // makes all src relative to cwd
            ]
          }
        },
        inlinecss: {
            main: {
                options: {
                },
                files: {
                    './source/index-inline.html': './source/index.html'
                }
            }
        },
        watch: {
            files: ['./source/index.html'],
            tasks: ['inlinecss'],
        },
        'string-replace': {
            dist: {
                files: {
                  './source/index-inline.html': './source/index-inline.html'
                },
                options: {
                  replacements: [{
                    pattern: 'http://projects.loadedcommunications.com.au/<%= _.slugify(projectName) %>/',
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