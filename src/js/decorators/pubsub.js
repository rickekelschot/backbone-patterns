/*global Backbone, _ */
Backbone.decorators || (Backbone.decorators = {});
Backbone.decorators.PubSub = {
    subscribe: Backbone.Radio.on.bind(Backbone.Radio, 'global'),

    subscribeOnce: Backbone.Radio.once.bind(Backbone.Radio, 'global'),

    unsubscribe: Backbone.Radio.off.bind(Backbone.Radio, 'global'),

    publish: Backbone.Radio.trigger.bind(Backbone.Radio, 'global'),

    channel: Backbone.Radio.channel
};