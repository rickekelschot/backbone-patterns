Backbone.Collection.prototype.findModel = (function (attrs, first) {
    var results = this.inspect(attrs);
    return (first) ? results[0] || null : results;
});