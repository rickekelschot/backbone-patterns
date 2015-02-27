Backbone.View.prototype.append = function (instance, region) {
    region = region || instance.region;
    var $container = this.$(region) || this.$el,
        instanceName = instance.name || _.uniqueId('view');

    if (region && region instanceof jQuery) {
        $container = region;
    }

    $container.append(instance);
    this.subview(instanceName, instance);
};
