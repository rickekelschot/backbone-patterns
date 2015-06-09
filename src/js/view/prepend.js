Backbone.View.prototype.prepend = function (view, options) {
    options = options || {};
    options.addMethod = 'prepend';
    this.append(view, options);
};