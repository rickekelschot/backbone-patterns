( function( root, factory ) {
    // Set up Ahold-Backbone for the environment. Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define( [ 'exports', 'backbone', 'underscore' ], factory );
    }
    // Next for Node.js or CommonJS.
    else if ( typeof exports !== 'undefined' ) {
        factory( exports, require( 'backbone' ), require( 'underscore' ) );
    }
    // Finally, as a browser global. Use `root` here as it references `window`.
    else {
        factory( root, root.Backbone, root._ );
    }
}( this, function( exports, Backbone, _ ) {;Backbone.utils = {};
Backbone.utils.readonly = (function (obj) {
    var descriptor;
    if (typeof Object.defineProperty !== "undefined") {
        descriptor = {
            writable: false,
            enumerable: true,
            configurable: false
        };

        var props = (arguments.length > 1) ? _.toArray(arguments).slice(1) : [];
        _.each(props, function (prop) {
            descriptor.value = obj[prop];
            Object.defineProperty(obj, prop, descriptor);
        });
        return true;
    }

    return false;
});;/*global Backbone, _ */

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


;/*global Backbone, _ */
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
};;/*global Backbone, _ */
Backbone.decorators || (Backbone.decorators = {});
Backbone.decorators.RequestResponse = {
    setResponder: function (name, responder, scope) {
        Backbone.mediator.setResponder.apply(Backbone.mediator, arguments);
    },

    request: function (name) {
        return Backbone.mediator.request.apply(Backbone.mediator, arguments);
    }
};;/*global Backbone, _ */

_.extend(Backbone.View.prototype, Backbone.decorators.PubSub, Backbone.decorators.RequestResponse);;return Backbone;

}));