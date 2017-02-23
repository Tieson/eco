module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'src/js/**/*.js' ,'!src/js/**/*.min.js']
        },

        concat: {
            js: {
                files: {
                    'src/js_merge/main.js': ['src/js/*.js','src/js/**/*.js']
                }
                //src: ['src/js/*'],
                //dest: ['build/js/all.js'],
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd. mm. yyyy") %> */\n',
                preserveComments: false
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/js_merge',
                    src: ['*.js', '!*.min.js', '!*.pack.js'],
                    dest: 'src/styles/js',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'src/css',
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
                    'src/css/style.css': 'src/sass/main.scss',
                }
            }
        },

        watch: {
            styles: {
                files: ['src/sass/*.scss', 'src/sass/**/*.scss'],
                tasks: ['sass', 'cssmin'],
                options: {
                    spawn: false,
                }
            },
            scripts: {
                files: ['src/js/*.js'],
                tasks: ['jshint', 'concat', 'uglify']
            }
        },

        sprite: {
            all: {
                algorithm: 'binary-tree',
                src: 'src/img/icons/*.png',
                dest: 'build/images/spr_icons.png',
                destCss: 'src/styles/sass/spr_icons.scss'
            },
            socials: {
                src: 'src/img/socials/*.png',
                dest: 'src/images/spr_socials.png',
                destCss: 'src/styles/sass/spr_socials.scss'
            }
        }

    });

    // Load the plugin that provides the "uglify" task.

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-sass');

    grunt.loadNpmTasks('grunt-spritesmith');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('style', ['sass', 'cssmin']);
    grunt.registerTask('script', ['jshint', 'concat', 'uglify']);

};