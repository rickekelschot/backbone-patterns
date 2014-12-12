/*global Backbone, _ */

Backbone.mediator = function () {};

_.extend(Backbone.mediator.prototype, {
    subscribe: function (name, handler, scope) {
        Backbone.Events.on.apply(this, arguments);
    },

    subscribeOnce: function (name, handler, scope) {
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
        var handler;
        if (this.handlers) {
            handler = this.handlers[name] || this.handlers['catch-unregistered'];
        }
        if (handler) {
            var scope = handler.scope || null,
                props = (arguments.length > 1) ? _.toArray(arguments).slice(1) : [];

            //Add request name to start of arguments
            if (handler === this.handlers['catch-unregistered']) {
                props.unshift(name);
            }

            return handler.responder.apply(scope, props);
        }
        throw Error('Backbone.mediator -> Response handler for (' + name + ') is not registered and there is no catch-unregistered handler registered');
    }
});

Backbone.mediator = new Backbone.mediator();
Backbone.utils.readonly(Backbone.mediator, 'subscibe', 'subscibeOnce', 'unsubscribe', 'publish');


