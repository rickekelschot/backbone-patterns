Backbone.utils = Backbone.utils || {};
Backbone.utils.loadModule = (function () {
    var define, enqueue, require;

    define = window.define;
    require = window.require;
    if (typeof define === 'function' && define.amd) {
        return function (moduleName, handler) {
            handler(require(moduleName));
        };
    } else {
        enqueue = typeof setImmediate !== "undefined" && setImmediate !== null ? setImmediate : setTimeout;
        return function (moduleName, handler) {
            return enqueue(function () {
                return handler(require(moduleName));
            });
        };
    }
})();