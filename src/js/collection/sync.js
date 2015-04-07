Backbone.Collection.prototype.sync = (function () {
    delete this.xhr;
    return Backbone.sync.apply(this, arguments);
});