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

    });


    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task.
    grunt.registerTask('default', ['clean','copy', 'imagemin','compress']);
};