/*jslint nomen: true, todo: true */
/*global module  */

/* Grunt
 * ============================================================================== */

module.exports = function (grunt) {

    'use strict';

    require('time-grunt')(grunt);

    var moduleName = "settings";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* Closure
         * ---------------------------------------------------------------------- */

        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: 8888
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            js: {
                files: [
                    'src/js/**/*.js',
                    'test/**/*.js'
                ],
                tasks: ['build', 'karma:test']
            }
        },

        preprocess: {
            supercharger: {
                src: 'src/js/backbone-supercharger.js',
                dest: 'dist/backbone-supercharger.js'
            }
        },

        radioPkg: grunt.file.readJSON('node_modules/backbone.radio/package.json'),
        meta: {
            version: '<%= radioPkg.version %>',
            banner: '// Backbone.Radio v<%= meta.version %>\n'
        },

        template: {
            options: {
                data: {
                    version: '<%= meta.version %>'
                }
            },
            supercharger: {
                src: '<%= preprocess.supercharger.dest %>',
                dest: '<%= preprocess.supercharger.dest %>'
            }
        },

        karma: {
            test: {
                singleRun: true,
                configFile: 'karma.conf.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-template');

    grunt.registerTask('default', ['build', 'connect', 'watch']);
    grunt.registerTask('build', ['preprocess', 'template']);

};
