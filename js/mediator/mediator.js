/*global Backbone, _ */

Backbone.mediator = function () {};

_.extend(Backbone.mediator.prototype, {
    subscibe: function (name, handler, scope) {
        Backbone.Events.on.apply(this, arguments);
    },

    subscibeOnce: function (name, handler, scope) {
        Backbone.Events.once.apply(this, arguments);
    },

    unsubscribe: function (name, handler, scope) {
        Backbone.Events.off.apply(this, arguments);
    },

    publish: function (name) {
        Backbone.Events.trigger.apply(this, arguments);
    },

    setResponder: function (name, responder, scope) {
        this.handlers || (this.handlers = []);
        this.handlers[name] = {
            responder: responder,
            scope: scope
        };
    },

    request: function (name) {
        if (this.handlers && this.handlers[name]) {
            var scope = this.handlers[name].scope || null,
                props = (arguments.length > 1) ? _.toArray(arguments).slice(1) : [];

            return this.handlers[name].responder.apply(scope, props);
        }
        throw Error('Backbone.mediator -> Response handler for (' + name + ') is not registered');
    }
});

Backbone.mediator = new Backbone.mediator();
Backbone.utils.readonly(Backbone.mediator, 'subscibe', 'subscibeOnce', 'unsubscribe', 'publish');


