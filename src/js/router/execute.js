Backbone.Router.prototype.execute = function(callback, args) {
    Backbone.history.trigger('pre-route', args);
    this.trigger('pre-route', args);

    if (callback) callback.apply(this, args);

    Backbone.history.trigger('post-route', args);
    this.trigger('post-route', args);
};