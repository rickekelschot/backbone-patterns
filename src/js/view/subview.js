Backbone.View.prototype.subview = function (name, instance) {
    if (typeof name === 'undefined') {
        throw new Error('Subview name is not defined');
    }

    this.subviews = this.subviews || {};

    if (typeof instance === 'undefined') {
        return this.subviews[name];
    }

    if (this.subviews[name]) {
        throw new Error('A subview with name: ' + name + ' already exists. Call removeSubview before adding it.');
    }

    this.subviews[name] = instance;
    return this.subviews[name];
};

Backbone.View.prototype.removeSubview = function (name) {
    if (this.subviews[name]) {
        this.subviews[name].remove();
        delete this.subviews[name];
    }
}

Backbone.View.prototype.removeSubviews = function () {
    _.invoke(this.subviews, 'remove');
    this.subviews = {};
}