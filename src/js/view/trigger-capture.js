/**
 * Capture an event from the view onto it's children
 * @param name
 */

Backbone.View.prototype.triggerCapture = function (name) {
    this.trigger.apply(this, arguments);

    for (var key in this.subviews) {
        var subview = this.subviews[key];
        if (_.isFunction(subview.triggerCapture)) {
            subview.triggerCapture.apply(subview, arguments);
        }
    }
};
