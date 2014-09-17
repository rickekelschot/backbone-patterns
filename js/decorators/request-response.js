/*global Backbone, _ */
Backbone.decorators || (Backbone.decorators = {});
Backbone.decorators.RequestResponse = {
    setResponder: function (name, responder, scope) {
        Backbone.mediator.setResponder.apply(Backbone.mediator, arguments);
    },

    request: function (name) {
        return Backbone.mediator.request.apply(Backbone.mediator, arguments);
    }
};