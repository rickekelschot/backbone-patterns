Backbone.View.prototype.prepend = function (view, options) {
    options = options || {};
    options.addMethod = true;
    this.append(view, options);
};