var oldFetch = Backbone.Collection.prototype.fetch;
Backbone.Collection.prototype.fetch = function (options) {
    if (typeof Promise === 'undefined' || options) {
        return oldFetch.apply(this, arguments);
    }

    var promise = new Promise(function (resolve, reject) {
        oldFetch.call(this, {
            success: resolve,
            error: reject
        });
    });

    return promise;
};