Backbone.View.prototype.append = function (view, region) {
    region = region || view.region;
    
    if (!(view instanceof Backbone.View)) {
        throw new Error('Instance is not a ')
    }
    
    var $container = this.$(region)[0] ? this.$(region) : this.$el,
        viewName = view.name || _.uniqueId('view');

    view.render();
    $container.append(view.$el);

    this.subview(viewName, view);
};
