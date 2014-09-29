Backbone.View.prototype._subscribeToEvents = (function () {
    if (this.subscribeTo) {
        for (var key in this.subscribeTo) {
            if (typeof this[this.subscribeTo[key]] === 'function') {
                this.subscribe(key, this[this.subscribeTo[key]], this);
            }
        }
    }
});

Backbone.View.prototype._unSubscribeToEvents = (function () {
    if (this.subscribeTo) {
        for (var key in this.subscribeTo) {
            if (typeof this[this.subscribeTo[key]] === 'function') {
                this.unsubscribe(key, this[this.subscribeTo[key]], this);
            }
        }
    }
});
