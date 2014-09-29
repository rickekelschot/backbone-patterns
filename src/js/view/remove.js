var oldRemove = Backbone.View.prototype.remove;
Backbone.View.prototype.remove = (function () {
    this._unSubscribeToEvents();
    oldRemove.apply(this, arguments);
});
