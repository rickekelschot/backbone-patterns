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

    this.listenTo(instance, 'removed', this.onSubviewRemoved);

    this.subviews[name] = instance;
    return this.subviews[name];
};

Backbone.View.prototype.onSubviewRemoved = function (view) {
    var viewName;

    _.each(this.subviews, function (subview, key) {
        if (view === subview) {
            viewName = key;
        }
    });

    if (viewName) {
        delete this.subviews[viewName];
        this.trigger('subview-removed', viewName);
    }
}

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