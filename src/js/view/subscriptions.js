Backbone.View.prototype.parseSubscriptions = (function (doSubscribe) {
    if (typeof this.subscriptions !== 'undefined') {
        _.each(this.subscriptions, function (events, channel) {
            if (_.isObject(events)) {
                _.each(events, function (handler, event) {
                    if (typeof this[handler] === 'function') {
                        if (doSubscribe) {
                            this.channel(channel).subscribe(event, this[handler], this);
                        } else {
                            this.channel(channel).unsubscribe(event, this[handler], this);
                        }
                    }
                }.bind(this));
            } else if (typeof this[events] === 'function') {
                //Legacy, for old notation
                if (doSubscribe) {
                    this.subscribe(channel, this[events], this);
                } else {
                    this.unsubscribe(channel, this[events], this);
                }
            }
        }.bind(this));
    }
});

Backbone.View.prototype.subscribeToEvents = (function () {
    this.parseSubscriptions(true);
});

Backbone.View.prototype.unSubscribeToEvents = (function () {
    this.parseSubscriptions(false);
});
