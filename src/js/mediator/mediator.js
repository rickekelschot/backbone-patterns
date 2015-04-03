/*global Backbone, _ */
(function () {
    var Channel = function (name) {
        this.name = name;
        this.handlers = {};
        this.commands = {};
    };

    _.extend(Channel.prototype, Backbone.Events);
    _.extend(Channel.prototype, {
        subscribe: function (name, handler, scope) {
            this.on.apply(this, arguments);
        },

        subscribeOnce: function (name, handler, scope) {
            this.once.apply(this, arguments);
        },

        unsubscribe: function (name, handler, scope) {
            this.off.apply(this, arguments);
        },

        publish: function (name) {
            this.trigger.apply(this, arguments);
        },

        setResponder: function (name, responder, scope) {
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
            throw Error('Backbone.mediator (' + this.name + ' channel) -> Response handler for (' + name + ') is not registered and there is no catch-unregistered handler registered');
        },

        comply: function (id, command) {
            if (!id) {
                this.throwError('A valid id is required to add a command');
            }
            if (!command) {
                this.throwError('A command constructor is required');
            }

            if (typeof command.prototype.execute !== 'function') {
                this.throwError('A command must implement a execute method');
            }
        },

        throwError: function (message) {
            throw new Error('Channel (' + this.name + '): ' + message);
        }
    });


    Backbone.mediator = function () {
        this.global = this.channel('global');
    };

    _.extend(Backbone.mediator.prototype, {

        subscribe: function (name, handler, scope) {
            return this.global.subscribe.apply(this.global, arguments);
        },

        subscribeOnce: function (name, handler, scope) {
            return this.global.subscribeOnce.apply(this.global, arguments);
        },

        unsubscribe: function (name, handler, scope) {
            return this.global.unsubscribe.apply(this.global, arguments);
        },

        publish: function (name) {
            return this.global.publish.apply(this.global, arguments);
        },

        setResponder: function (name, responder, scope) {
            return this.global.setResponder.apply(this.global, arguments);
        },

        request: function (name) {
            return this.global.request.apply(this.global, arguments);
        },

        channel: function (name) {
            this.channels || (this.channels = {});
            if (!this.channels[name]) {
                this.addChannel(name);
            }

            return this.channels[name];
        },

        addChannel: function (name) {
            this.channels[name] = new Channel(name);
        }

    });

    Backbone.mediator = new Backbone.mediator();
    Backbone.utils.readonly(Backbone.mediator, 'subscibe', 'subscibeOnce', 'unsubscribe', 'publish');

})();


