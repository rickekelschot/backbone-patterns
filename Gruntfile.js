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

        concat: {
            options: {
                separator: ';'
            },
            test: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/lodash/dist/lodash.compat.min.js',
                    'bower_components/backbone/backbone.js',
                    'module-pattern/module-start.js',
                    'js/utils/readonly.js',
                    'js/mediator/mediator.js',
                    'js/decorators/pubsub.js',
                    'js/decorators/request-response.js',
                    'js/view/view.js',
                    'module-pattern/module-end.js',
                    'js/test.js'
                ],
                dest: './dist/backbone-ahold.js'
            },

            build: {
                src: [
                    'module-pattern/module-start.js',
                    'js/utils/readonly.js',
                    'js/mediator/mediator.js',
                    'js/decorators/pubsub.js',
                    'js/decorators/request-response.js',
                    'js/view/view.js',
                    'module-pattern/module-end.js'
                ],
                dest: './dist/backbone-ahold.js'
            }
        },

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
                files: ['js/**/*.js'],
                tasks: ['concat:test']
            }
        },

        amdwrap: {
            onlyOneFile: {
                src: './dist/backbone-ahold.js',
                dest: './dist/backbone-ahold.js'
            }

        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-amd-wrap');

    grunt.registerTask('default', ['concat:test', 'connect', 'watch']);
    grunt.registerTask('build', ['concat:build']);

};
