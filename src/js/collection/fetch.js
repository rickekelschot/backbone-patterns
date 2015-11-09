var oldCollectionFetch = Backbone.Collection.prototype.fetch;
Backbone.Collection.prototype.fetch = (function (options) {
    options = options || {};
    if (options.success || options.error || !Backbone.$) {
        return oldCollectionFetch.call(this, options);
    }

    var promise = Backbone.$.Deferred(),
        resolve, reject;

    resolve = function () {
        this.off('sync', resolve);
        this.off('error', reject);
        promise.resolve();
    };

    reject = function () {
        this.off('sync', resolve);
        this.off('error', reject);
        promise.reject();
    };

    this.once('sync', resolve.bind(this));
    this.once('error', reject.bind(this));

    if (!this.isFetching) {
        options.success = options.error = function () {
            this.isFetching = false;
        }.bind(this);

        this.isFetching = true;
        this.xhr = oldCollectionFetch.call(this, options);
    }

    return promise;
});

