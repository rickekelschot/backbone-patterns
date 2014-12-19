var oldFetch = Backbone.Model.prototype.fetch;
Backbone.Model.prototype.fetch = (function (options) {
    options = options || {};
    if (options.success || options.error || !Backbone.$) {
        return oldFetch.call(this, options);
    }

    var promise = Backbone.$.Deferred();
    options.success = promise.resolve;
    options.error = promise.reject;

    oldFetch.call(this, options);

    return promise;
});

