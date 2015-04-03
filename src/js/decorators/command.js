/*global Backbone, _ */
Backbone.decorators || (Backbone.decorators = {});
Backbone.decorators.Command = {
    command: Backbone.Radio.command.bind(Backbone.Radio, 'global'),

    comply: Backbone.Radio.comply.bind(Backbone.Radio, 'global'),

    complyOnce: Backbone.Radio.complyOnce.bind(Backbone.Radio, 'global'),

    stopComplying: Backbone.Radio.stopComplying.bind(Backbone.Radio, 'global'),

    channel: Backbone.Radio.channel
};