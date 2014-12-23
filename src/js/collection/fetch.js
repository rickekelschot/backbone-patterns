var oldCollectionFetch = Backbone.Collection.prototype.fetch;
Backbone.Collection.prototype.fetch = (function (options) {
    options = options || {};
    if (options.success || options.error || !Backbone.$) {
        return oldCollectionFetch.call(this, options);
    }

    var promise = Backbone.$.Deferred();
    options.success = promise.resolve;
    options.error = promise.reject;

    oldCollectionFetch.call(this, options);

    return promise;
});
