Backbone.View.prototype._subscribeToEvents = (function () {
    if (typeof this.subscriptions !== 'undefined') {
        for (var key in this.subscriptions) {
            if (typeof this[this.subscriptions[key]] === 'function') {
                this.subscribe(key, this[this.subscriptions[key]], this);
            }
        }
    }
});

Backbone.View.prototype._unSubscribeToEvents = (function () {
    if (typeof this.subscriptions !== 'undefined') {
        for (var key in this.subscriptions) {
            if (typeof this[this.subscriptions[key]] === 'function') {
                this.unsubscribe(key, this[this.subscriptions[key]], this);
            }
        }
    }
});
