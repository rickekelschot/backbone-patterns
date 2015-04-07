var oldRemove = Backbone.View.prototype.remove;
Backbone.View.prototype.remove = (function () {
    this.unSubscribeToEvents();
    this.removeSubviews();
    this.isAppended = false;
    this.trigger('removed');
    oldRemove.apply(this, arguments);
});
