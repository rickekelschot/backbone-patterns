var allTestFiles = [];
var TEST_REGEXP = /(spec)\.js$/i;

var pathToModule = function (path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',

    // dynamically load all test files
    deps: allTestFiles,

    paths: {
        backbone: '/base/node_modules/backbone/backbone',
        underscore: '/base/node_modules/underscore/underscore',
        jquery: '/base/node_modules/jquery/dist/jquery',
        radio: '/base/node_modules/backbone.radio/build/backbone.radio',
        supercharger: '/base/dist/backbone-supercharger',
        sinon: '/base/node_modules/sinon/pkg/sinon'
    },
    shim: {
        backbone: {exports: 'Backbone', deps: ['underscore']},
        supercharger: {deps: ['backbone', 'radio']}
    },

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
