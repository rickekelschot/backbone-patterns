Backbone.View.prototype.subview = function (name, instance) {
    if (typeof name === 'undefined') {
        throw new Error('Subview name is not defined');
    }

    this.subviews = this.subviews || {};

    if (typeof instance === 'undefined') {
        return this.subviews[name];
    }

    this.subviews[name] = instance;
    return this.subviews[name];
};

Backbone.View.prototype._removeSubviews = function () {
    _.invoke(this.subviews, 'remove');
}