Backbone.View.prototype.dispose = (function () {
    var dispose = _.keys(this);

    _.each(dispose, function (key) {
        delete this[key];
    }.bind(this));

    this.disposed = true;
    Backbone.utils.readonly(this);
});