/**
 * Bubbles an event from the view to it's parents
 * @param name
 */

Backbone.View.prototype.bubble = function (name) {
    this.trigger.apply(this, arguments);

    if (this.parent instanceof Backbone.View && _.isFunction(this.parent.bubble)) {
        this.parent.bubble.apply(this, arguments);
    }
};
