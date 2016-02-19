/**
 * Bubbles an event from the view to it's parents
 * @param name
 */

Backbone.View.prototype.triggerBubble = function (name) {
    this.trigger.apply(this, arguments);

    if (this.parent instanceof Backbone.View && _.isFunction(this.parent.triggerBubble)) {
        this.parent.triggerBubble.apply(this.parent, arguments);
    }
};
