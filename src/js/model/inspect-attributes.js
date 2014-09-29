Backbone.Model.prototype.inspectAttributes = (function (attrs) {
    var results = [];
    _.each(this.attributes, function (attribute) {
        if (attribute instanceof Backbone.Collection) {
            results = results.concat(attribute.inspect(attrs));
        } else if (attribute instanceof Backbone.Model) {
            results = results.concat(attribute.inspect(attrs));
        }
    });
    return results;
});
