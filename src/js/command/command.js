/*global Backbone, _ */

Backbone.Command = Backbone.Class.extend({
    optionNames: ['onComplete', 'onError'],

    promise: null,
    resolve: null,
    reject: null,

    constructor: function () {
        Backbone.Class.prototype.apply(this, arguments);
        this.promise = Backbone.$.Deferred();
        _.bindAll(this, 'complete', 'error');
    },

    execute: function () {
        return this.promise;
    },

    complete: function () {
        if (_.isFunction(this.resolve)) {
            if (_.isFunction(this.onComplete)) {
                this.onComplete(arguments);
            }
            this.promise.resolve.apply(this, arguments);
            this.dispose();
        }
    },

    error: function () {
        if (_.isFunction(this.reject)) {
            if (_.isFunction(this.onError)) {
                this.onError(arguments);
            }
            this.promise.reject.apply(this, arguments);
            this.dispose();
        }
    },

    disposed: false,

    dispose: function () {
        // if (this.disposed) {
        //     return;
        // }
        //
        // var obj, prop,
        //     hasProp = {}.hasOwnProperty;
        //
        // for (prop in this) {
        //     if (!hasProp.call(this, prop)) continue;
        //     obj = this[prop];
        //     if (!(obj && typeof obj.dispose === 'function')) {
        //         continue;
        //     }
        //     obj.dispose();
        //     delete this[prop];
        // }
        //
        // this.disposed = true;
        // if (typeof Object.freeze === "function") {
        //     Object.freeze(this);
        // }
    }

}, Backbone.decorators.RequestResponse, Backbone.Events);
