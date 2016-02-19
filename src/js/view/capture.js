/**
 * Capture an event from the view onto it's children
 * @param name
 */

Backbone.View.prototype.capture = function (name) {
    this.trigger.apply(this, arguments);

    _.each(this.subviews, function (subview) {
        if (_.isFunction(subview.capture)) {
            subview.capture.apply(subview, arguments);
        }
    });
};
