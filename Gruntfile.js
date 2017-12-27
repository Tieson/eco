module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // jshint: {
        //     all: ['Gruntfile.js', 'src/js/**/*.js' ,'!src/js/**/*.min.js']
        // },

        concat: {
            js: {
                files: {
                    'src/modules.js': [
                        'src/modules/vhdlExporter.js',
                        'src/modules/generic.js',
                        'src/modules/entities.js',
                        'src/modules/files.js',
                        'src/modules/main.js',
                        'src/modules/schema.js',
                        'src/modules/modal.js',
                        'src/modules/tasks.js',
                        'src/modules/student.js',
                        'src/modules/homeworks.js',
                        'src/modules/users.js',
                        'src/modules/group.js',
                        'src/modules/simmulator.js'
                    ],
                    'src/helpers.js': [
                        'src/helpers/util.js',
                        'src/helpers/counters.js',
                        'src/helpers/formaters.js',
                        'src/helpers/validators.js',
                        'src/helpers/snackbar.js',
                        'src/helpers/mappers.js'
                    ],
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> */\n',
                preserveComments: false
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    // src: ['*.js', '!*.min.js', '!*.pack.js'],
                    src: ['*.js', '!*.min.js', '!*.pack.js'],
                    dest: 'src/',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'assets/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'assets/css',
                    ext: '.min.css',
                    extDot: 'last'
                }]
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'assets/css/style.css': 'assets/sass/main.scss',
                }
            }
        },

        watch: {
            styles: {
                files: ['assets/sass/*.scss', 'assets/sass/**/*.scss'],
                tasks: ['sass', 'cssmin'],
                options: {
                    spawn: false,
                }
            },
            // scripts: {
            //     files: ['assets/js/*.js'],
            //     tasks: ['jshint', 'concat', 'uglify']
            // }
        },
    });

    // Load the plugin that provides the "uglify" task.

    grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-sass');

    // grunt.loadNpmTasks('grunt-spritesmith');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('style', ['sass', 'cssmin']);
    // grunt.registerTask('script', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('script', ['concat', 'uglify']);

};