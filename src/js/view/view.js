/*global Backbone, _ */

_.extend(Backbone.View.prototype, Backbone.decorators.PubSub, Backbone.decorators.RequestResponse);