Backbone.Collection.prototype.inspect = (function (attrs) {
    var results = [];
    _.each(this.models, function (model) {
        results = results.concat(model.inspect(attrs));
    });
    return results;
});
