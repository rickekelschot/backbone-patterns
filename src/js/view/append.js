Backbone.View.prototype.append = function (view, options) {
    options = options || {};

    if (!(view instanceof Backbone.View)) {
        throw new Error('View is not a instance of Backbone.View')
    }

    var region = options.region || view.region,
        viewName = options.name || view.cid,
        $container = this.$(region)[0] ? this.$(region) : this.$el;

    view.render();
    $container.append(view.$el);

    view.isAppended = true;
    view.trigger('appended');

    this.subview(viewName, view);
};
