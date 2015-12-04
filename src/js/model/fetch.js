var oldFetch = Backbone.Model.prototype.fetch;
Backbone.Model.prototype.fetch = (function (options) {
    options = options || {};
    if (options.success || options.error || !Backbone.$) {
        return oldFetch.call(this, options);
    }

    var promise = Backbone.$.Deferred(),
        resolve, reject;

    resolve = function () {
        this.off('sync', resolve);
        this.off('error', reject);
        promise.resolve.apply(this, arguments);
    };

    reject = function () {
        this.off('sync', resolve);
        this.off('error', reject);
        promise.reject.apply(this, arguments);
    };

    this.once('sync', resolve.bind(this));
    this.once('error', reject.bind(this));

    if (!this.isFetching) {
        options.success = options.error = function () {
            this.isFetching = false;
        }.bind(this);

        this.isFetching = true;
        this.xhr = oldFetch.call(this, options);
    }

    return promise;
});