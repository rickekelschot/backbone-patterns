var oldRemove = Backbone.View.prototype.remove;
Backbone.View.prototype.remove = (function () {
    this._unSubscribeToEvents();
    this._removeSubviews();
    this.isAppended = false;
    oldRemove.apply(this, arguments);
});
