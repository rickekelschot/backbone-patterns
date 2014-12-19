var oldSave = Backbone.Model.prototype.save;
Backbone.Model.prototype.save = (function (key, val, options) {
    options = options || {};
    if (options.success || options.error || !Backbone.$) {
        return oldSave.call(this, key, val, options);
    }

    var promise = Backbone.$.Deferred();
    options.success = promise.resolve;
    options.error = promise.reject;

    oldSave.call(this, key, val, options);

    return promise;
});

