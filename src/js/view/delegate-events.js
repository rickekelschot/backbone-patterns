/**
 * Extend delegateEvents with bubble and capture event logic
 * @param events
 */

var oldDelegateEvents = Backbone.View.prototype.delegateEvents;
Backbone.View.prototype.delegateEvents = function (events) {
    oldDelegateEvents.call(this, events);

    this.delegateViewEvents(_.result(this, 'bubble'));
    this.delegateViewEvents(_.result(this, 'capture'));

    return this;
};
