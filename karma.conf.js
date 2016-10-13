// Karma configuration
// Generated on Mon Apr 11 2016 14:33:46 GMT+0200 (CEST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',

        client: {
            captureConsole: true,
            mocha: {
                bail: true
            }
        },

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'requirejs', 'chai-sinon'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            { pattern: 'node_modules/jquery/dist/jquery.js', included: false },
            { pattern: 'node_modules/underscore/underscore.js', included: false },
            { pattern: 'node_modules/backbone/backbone.js', included: false },
            { pattern: 'node_modules/backbone.radio/build/backbone.radio.js', included: false },
            { pattern: 'node_modules/sinon/pkg/sinon.js', included: false },
            { pattern: 'dist/backbone-supercharger.js', included: false },
            { pattern: 'test/**/*.js', included: false },
            'test/test-config.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},

        reporters: ['spec'],
        port: 8080,
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        captureTimeout: 6000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
};
