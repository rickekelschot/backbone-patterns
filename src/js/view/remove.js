var oldRemove = Backbone.View.prototype.remove;
Backbone.View.prototype.remove = (function () {
    this._unSubscribeToEvents();
    this._removeSubviews();
    oldRemove.apply(this, arguments);
});
