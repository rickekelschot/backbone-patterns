/**
 * Delegate View events. These events are triggered by Backbone.Events API
 * @param events
 */

Backbone.View.prototype.undelegateViewEvents = function (events) {
    if (!events) return this;
    viewEventDelegation(events, this, true);
    return this;
};
