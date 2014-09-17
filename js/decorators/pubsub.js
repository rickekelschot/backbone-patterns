/*global Backbone, _ */
Backbone.decorators || (Backbone.decorators = {});
Backbone.decorators.PubSub = {
    subscibe: function (name, handler, scope) {
        Backbone.mediator.subscibe.apply(Backbone.mediator, arguments);
    },

    subscibeOnce: function (name, handler, scope) {
        Backbone.mediator.subscibeOnce.apply(Backbone.mediator, arguments);
    },

    unsubscibe: function (name, handler, scope) {
        Backbone.mediator.unsubscibe.apply(Backbone.mediator, arguments);
    },

    publish: function (name, value) {
        Backbone.mediator.publish.apply(Backbone.mediator, arguments);
    }
};