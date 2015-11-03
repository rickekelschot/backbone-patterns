var oldCollectionFetch = Backbone.Collection.prototype.fetch;
Backbone.Collection.prototype.fetch = (function (options) {
    options = options || {};
    if (options.success || options.error || !Backbone.$) {
        return oldCollectionFetch.call(this, options);
    }
    
    var promise = Backbone.$.Deferred();
    this.once('sync', promise.resolve);
    this.once('error', promise.reject);

    if (!this.isFetching) {
        options.success = options.error = function () {
            this.isFetching = false;
        }.bind(this);

        this.isFetching = true;
        this.xhr = oldCollectionFetch.call(this, options);
    }

    return promise;
});

