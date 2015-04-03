/*global Backbone, _ */
Backbone.decorators || (Backbone.decorators = {});
Backbone.decorators.PubSub = {
    subscribe: function (name, handler, scope) {
        return Backbone.mediator.subscribe.apply(Backbone.mediator, arguments);
    },

    subscribeOnce: function (name, handler, scope) {
        return Backbone.mediator.subscribeOnce.apply(Backbone.mediator, arguments);
    },

    unsubscribe: function (name, handler, scope) {
        return Backbone.mediator.unsubscribe.apply(Backbone.mediator, arguments);
    },

    publish: function (name, value) {
        return Backbone.mediator.publish.apply(Backbone.mediator, arguments);
    },

    channel: function (name) {
        return Backbone.mediator.channel.apply(Backbone.mediator, arguments);
    }
};