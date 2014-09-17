/*global Backbone, _ */
Backbone.decorators || (Backbone.decorators = {});
Backbone.decorators.PubSub = {
    subscribe: function (name, handler, scope) {
        Backbone.mediator.subscribe.apply(Backbone.mediator, arguments);
    },

    subscribeOnce: function (name, handler, scope) {
        Backbone.mediator.subscribeOnce.apply(Backbone.mediator, arguments);
    },

    unsubscribe: function (name, handler, scope) {
        Backbone.mediator.unsubscribe.apply(Backbone.mediator, arguments);
    },

    publish: function (name, value) {
        Backbone.mediator.publish.apply(Backbone.mediator, arguments);
    }
};