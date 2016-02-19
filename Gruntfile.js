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
                files: ['src/js/**/*.js'],
                tasks: ['build']
            }
        },

        preprocess: {
            patterns: {
                src: 'src/js/backbone-patterns.js',
                dest: 'dist/backbone-patterns.js'
            }
        },

        radioPkg: grunt.file.readJSON('bower_components/backbone.radio/package.json'),
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
            patterns: {
                src: '<%= preprocess.patterns.dest %>',
                dest: '<%= preprocess.patterns.dest %>'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-template');

    grunt.registerTask('default', ['build', 'connect', 'watch']);
    grunt.registerTask('build', ['preprocess', 'template']);

};
