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
                    'bower_components/jquery/jquery.js',
                    'bower_components/underscore/underscore.js',
                    'bower_components/backbone/backbone.js',
                    'src/module-pattern/module-start.js',
                    'src/js/utils/readonly.js',
                    'src/js/mediator/mediator.js',
                    'src/js/decorators/pubsub.js',
                    'src/js/decorators/request-response.js',
                    'src/js/collection/inspect.js',
                    'src/js/collection/find-model.js',
                    'src/js/collection/fetch.js',
                    'src/js/model/inspect-attributes.js',
                    'src/js/model/inspect.js',
                    'src/js/model/fetch.js',
                    'src/js/model/save.js',
                    'src/js/view/constructor.js',
                    'src/js/view/append.js',
                    'src/js/view/pubsub.js',
                    'src/js/view/render.js',
                    'src/js/view/subscriptions.js',
                    'src/js/view/subview.js',
                    'src/js/view/remove.js',
                    'src/module-pattern/module-end.js'
                ],
                dest: './dist/backbone-patterns.js'
            },

            build: {
                src: [
                    'src/module-pattern/module-start.js',
                    'src/js/utils/readonly.js',
                    'src/js/mediator/mediator.js',
                    'src/js/decorators/pubsub.js',
                    'src/js/decorators/request-response.js',
                    'src/js/collection/inspect.js',
                    'src/js/collection/find-model.js',
                    'src/js/collection/fetch.js',
                    'src/js/model/inspect-attributes.js',
                    'src/js/model/inspect.js',
                    'src/js/model/fetch.js',
                    'src/js/model/save.js',
                    'src/js/view/constructor.js',
                    'src/js/view/append.js',
                    'src/js/view/pubsub.js',
                    'src/js/view/render.js',
                    'src/js/view/subscriptions.js',
                    'src/js/view/subview.js',
                    'src/js/view/remove.js',
                    'src/module-pattern/module-end.js'
                ],
                dest: './dist/backbone-patterns.js'
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
                files: ['src/js/**/*.js'],
                tasks: ['concat:test']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat:test', 'connect', 'watch']);
    grunt.registerTask('build', ['concat:build']);

};
