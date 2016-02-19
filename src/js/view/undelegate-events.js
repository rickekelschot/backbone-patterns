/**
 * Extend delegateEvents with bubble and capture event logic
 * @param events
 */

var oldUndelegateEvents = Backbone.View.prototype.undelegateEvents;
Backbone.View.prototype.undelegateEvents = function (events) {
    oldUndelegateEvents.call(this, events);

    this.undelegateViewEvents(_.result(this, 'bubble'));
    this.undelegateViewEvents(_.result(this, 'capture'));
};
