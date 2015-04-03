/*global Backbone, _ */

Backbone.decorators || (Backbone.decorators = {});
Backbone.decorators.RequestResponse = {
    reply: Backbone.Radio.reply.bind(Backbone.Radio, 'global'),

    replyOnce: Backbone.Radio.replyOnce.bind(Backbone.Radio, 'global'),

    stopReplying: Backbone.Radio.stopReplying.bind(Backbone.Radio, 'global'),

    request: Backbone.Radio.request.bind(Backbone.Radio, 'global'),

    channel: Backbone.Radio.channel

};
