(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore'], function (Backbone, _) {
            return factory(Backbone, _);
        });
    }
    else if (typeof exports !== 'undefined') {
        var Backbone = require('backbone');
        var _ = require('underscore');
        module.exports = factory(Backbone, _);
    }
    else {
        factory(root.Backbone, root._);
    }
}(this, function (Backbone, _) {
    'use strict';

    var previousRadio = Backbone.Radio;
    
    var Radio = Backbone.Radio = {};
    
    Radio.VERSION = '0.9.0';
    
    // This allows you to run multiple instances of Radio on the same
    // webapp. After loading the new version, call `noConflict()` to
    // get a reference to it. At the same time the old version will be
    // returned to Backbone.Radio.
    Radio.noConflict = function () {
      Backbone.Radio = previousRadio;
      return this;
    };
    
    // Whether or not we're in DEBUG mode or not. DEBUG mode helps you
    // get around the issues of lack of warnings when events are mis-typed.
    Radio.DEBUG = false;
    
    // Format debug text.
    Radio._debugText = function(warning, eventName, channelName) {
      return warning + (channelName ? ' on the ' + channelName + ' channel' : '') +
        ': "' + eventName + '"';
    };
    
    // This is the method that's called when an unregistered event was called.
    // By default, it logs warning to the console. By overriding this you could
    // make it throw an Error, for instance. This would make firing a nonexistent event
    // have the same consequence as firing a nonexistent method on an Object.
    Radio.debugLog = function(warning, eventName, channelName) {
      if (Radio.DEBUG && console && console.warn) {
        console.warn(Radio._debugText(warning, eventName, channelName));
      }
    };
    
    var eventSplitter = /\s+/;
    
    // An internal method used to handle Radio's method overloading for Requests and
    // Commands. It's borrowed from Backbone.Events. It differs from Backbone's overload
    // API (which is used in Backbone.Events) in that it doesn't support space-separated
    // event names.
    Radio._eventsApi = function(obj, action, name, rest) {
      if (!name) {
        return false;
      }
    
      var results = {};
    
      // Handle event maps.
      if (typeof name === 'object') {
        for (var key in name) {
          var result = obj[action].apply(obj, [key, name[key]].concat(rest));
          eventSplitter.test(key) ? _.extend(results, result) : results[key] = result;
        }
        return results;
      }
    
      // Handle space separated event names.
      if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
          results[names[i]] = obj[action].apply(obj, [names[i]].concat(rest));
        }
        return results;
      }
    
      return false;
    };
    
    // An optimized way to execute callbacks.
    Radio._callHandler = function(callback, context, args) {
      var a1 = args[0], a2 = args[1], a3 = args[2];
      switch(args.length) {
        case 0: return callback.call(context);
        case 1: return callback.call(context, a1);
        case 2: return callback.call(context, a1, a2);
        case 3: return callback.call(context, a1, a2, a3);
        default: return callback.apply(context, args);
      }
    };
    
    // A helper used by `off` methods to the handler from the store
    function removeHandler(store, name, callback, context) {
      var event = store[name];
      if (
         (!callback || (callback === event.callback || callback === event.callback._callback)) &&
         (!context || (context === event.context))
      ) {
        delete store[name];
        return true;
      }
    }
    
    function removeHandlers(store, name, callback, context) {
      store || (store = {});
      var names = name ? [name] : _.keys(store);
      var matched = false;
    
      for (var i = 0, length = names.length; i < length; i++) {
        name = names[i];
    
        // If there's no event by this name, log it and continue
        // with the loop
        if (!store[name]) {
          continue;
        }
    
        if (removeHandler(store, name, callback, context)) {
          matched = true;
        }
      }
    
      return matched;
    }
    
    /*
     * tune-in
     * -------
     * Get console logs of a channel's activity
     *
     */
    
    var _logs = {};
    
    // This is to produce an identical function in both tuneIn and tuneOut,
    // so that Backbone.Events unregisters it.
    function _partial(channelName) {
      return _logs[channelName] || (_logs[channelName] = _.partial(Radio.log, channelName));
    }
    
    _.extend(Radio, {
    
      // Log information about the channel and event
      log: function(channelName, eventName) {
        var args = _.rest(arguments, 2);
        console.log('[' + channelName + '] "' + eventName + '"', args);
      },
    
      // Logs all events on this channel to the console. It sets an
      // internal value on the channel telling it we're listening,
      // then sets a listener on the Backbone.Events
      tuneIn: function(channelName) {
        var channel = Radio.channel(channelName);
        channel._tunedIn = true;
        channel.on('all', _partial(channelName));
        return this;
      },
    
      // Stop logging all of the activities on this channel to the console
      tuneOut: function(channelName) {
        var channel = Radio.channel(channelName);
        channel._tunedIn = false;
        channel.off('all', _partial(channelName));
        delete _logs[channelName];
        return this;
      }
    });
    
    /*
     * Backbone.Radio.Commands
     * -----------------------
     * A messaging system for sending orders.
     *
     */
    
    Radio.Commands = {
    
      // Issue a command
      command: function(name) {
        var args = _.rest(arguments);
        if (Radio._eventsApi(this, 'command', name, args)) {
          return this;
        }
        var channelName = this.channelName;
        var commands = this._commands;
    
        // Check if we should log the command, and if so, do it
        if (channelName && this._tunedIn) {
          Radio.log.apply(this, [channelName, name].concat(args));
        }
    
        // If the command isn't handled, log it in DEBUG mode and exit
        if (commands && (commands[name] || commands['default'])) {
          var handler = commands[name] || commands['default'];
          args = commands[name] ? args : arguments;
          Radio._callHandler(handler.callback, handler.context, args);
        } else {
          Radio.debugLog('An unhandled command was fired', name, channelName);
        }
    
        return this;
      },
    
      // Register a handler for a command.
      comply: function(name, callback, context) {
        if (Radio._eventsApi(this, 'comply', name, [callback, context])) {
          return this;
        }
        this._commands || (this._commands = {});
    
        if (this._commands[name]) {
          Radio.debugLog('A command was overwritten', name, this.channelName);
        }
    
        this._commands[name] = {
          callback: callback,
          context: context || this
        };
    
        return this;
      },
    
      // Register a handler for a command that happens just once.
      complyOnce: function(name, callback, context) {
        if (Radio._eventsApi(this, 'complyOnce', name, [callback, context])) {
          return this;
        }
        var self = this;
    
        var once = _.once(function() {
          self.stopComplying(name);
          return callback.apply(this, arguments);
        });
    
        return this.comply(name, once, context);
      },
    
      // Remove handler(s)
      stopComplying: function(name, callback, context) {
        if (Radio._eventsApi(this, 'stopComplying', name)) {
          return this;
        }
    
        // Remove everything if there are no arguments passed
        if (!name && !callback && !context) {
          delete this._commands;
        } else if (!removeHandlers(this._commands, name, callback, context)) {
          Radio.debugLog('Attempted to remove the unregistered command', name, this.channelName);
        }
    
        return this;
      }
    };
    
    /*
     * Backbone.Radio.Requests
     * -----------------------
     * A messaging system for requesting data.
     *
     */
    
    function makeCallback(callback) {
      return _.isFunction(callback) ? callback : function () { return callback; };
    }
    
    Radio.Requests = {
    
      // Make a request
      request: function(name) {
        var args = _.rest(arguments);
        var results = Radio._eventsApi(this, 'request', name, args);
        if (results) {
          return results;
        }
        var channelName = this.channelName;
        var requests = this._requests;
    
        // Check if we should log the request, and if so, do it
        if (channelName && this._tunedIn) {
          Radio.log.apply(this, [channelName, name].concat(args));
        }
    
        // If the request isn't handled, log it in DEBUG mode and exit
        if (requests && (requests[name] || requests['default'])) {
          var handler = requests[name] || requests['default'];
          args = requests[name] ? args : arguments;
          return Radio._callHandler(handler.callback, handler.context, args);
        } else {
          Radio.debugLog('An unhandled request was fired', name, channelName);
        }
      },
    
      // Set up a handler for a request
      reply: function(name, callback, context) {
        if (Radio._eventsApi(this, 'reply', name, [callback, context])) {
          return this;
        }
    
        this._requests || (this._requests = {});
    
        if (this._requests[name]) {
          Radio.debugLog('A request was overwritten', name, this.channelName);
        }
    
        this._requests[name] = {
          callback: makeCallback(callback),
          context: context || this
        };
    
        return this;
      },
    
      // Set up a handler that can only be requested once
      replyOnce: function(name, callback, context) {
        if (Radio._eventsApi(this, 'replyOnce', name, [callback, context])) {
          return this;
        }
    
        var self = this;
    
        var once = _.once(function() {
          self.stopReplying(name);
          return makeCallback(callback).apply(this, arguments);
        });
    
        return this.reply(name, once, context);
      },
    
      // Remove handler(s)
      stopReplying: function(name, callback, context) {
        if (Radio._eventsApi(this, 'stopReplying', name)) {
          return this;
        }
    
        // Remove everything if there are no arguments passed
        if (!name && !callback && !context) {
          delete this._requests;
        } else if (!removeHandlers(this._requests, name, callback, context)) {
          Radio.debugLog('Attempted to remove the unregistered request', name, this.channelName);
        }
    
        return this;
      }
    };
    
    /*
     * Backbone.Radio.channel
     * ----------------------
     * Get a reference to a channel by name.
     *
     */
    
    Radio._channels = {};
    
    Radio.channel = function(channelName) {
      if (!channelName) {
        throw new Error('You must provide a name for the channel.');
      }
    
      if (Radio._channels[channelName]) {
        return Radio._channels[channelName];
      } else {
        return (Radio._channels[channelName] = new Radio.Channel(channelName));
      }
    };
    
    /*
     * Backbone.Radio.Channel
     * ----------------------
     * A Channel is an object that extends from Backbone.Events,
     * Radio.Commands, and Radio.Requests.
     *
     */
    
    Radio.Channel = function(channelName) {
      this.channelName = channelName;
    };
    
    _.extend(Radio.Channel.prototype, Backbone.Events, Radio.Commands, Radio.Requests, {
    
      // Remove all handlers from the messaging systems of this channel
      reset: function() {
        this.off();
        this.stopListening();
        this.stopComplying();
        this.stopReplying();
        return this;
      }
    });
    
    /*
     * Top-level API
     * -------------
     * Supplies the 'top-level API' for working with Channels directly
     * from Backbone.Radio.
     *
     */
    
    var channel, args, systems = [Backbone.Events, Radio.Commands, Radio.Requests];
    
    _.each(systems, function(system) {
      _.each(system, function(method, methodName) {
        Radio[methodName] = function(channelName) {
          args = _.rest(arguments);
          channel = this.channel(channelName);
          return channel[methodName].apply(channel, args);
        };
      });
    });
    
    Radio.reset = function(channelName) {
      var channels = !channelName ? this._channels : [this._channels[channelName]];
      _.invoke(channels, 'reset');
    };
    
    Backbone.Radio.Channel.prototype.subscribe = Backbone.Radio.Channel.prototype.on;
    Backbone.Radio.Channel.prototype.subscribeOnce = Backbone.Radio.Channel.prototype.once;
    Backbone.Radio.Channel.prototype.unsubscribe = Backbone.Radio.Channel.prototype.off;
    Backbone.Radio.Channel.prototype.publish = Backbone.Radio.Channel.prototype.trigger;
    
    Backbone.utils = {};
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
                try {
                    Object.defineProperty(obj, prop, descriptor);
                } catch (error) {}
            });
            return true;
        }
    
        return false;
    });
    /*global Backbone, _ */
    Backbone.decorators || (Backbone.decorators = {});
    Backbone.decorators.PubSub = {
        subscribe: Backbone.Radio.on.bind(Backbone.Radio, 'global'),
    
        subscribeOnce: Backbone.Radio.once.bind(Backbone.Radio, 'global'),
    
        unsubscribe: Backbone.Radio.off.bind(Backbone.Radio, 'global'),
    
        publish: Backbone.Radio.trigger.bind(Backbone.Radio, 'global'),
    
        channel: Backbone.Radio.channel
    };
    /*global Backbone, _ */
    
    Backbone.decorators || (Backbone.decorators = {});
    Backbone.decorators.RequestResponse = {
        reply: Backbone.Radio.reply.bind(Backbone.Radio, 'global'),
    
        replyOnce: Backbone.Radio.replyOnce.bind(Backbone.Radio, 'global'),
    
        stopReplying: Backbone.Radio.stopReplying.bind(Backbone.Radio, 'global'),
    
        request: Backbone.Radio.request.bind(Backbone.Radio, 'global'),
    
        channel: Backbone.Radio.channel
    
    };
    
    /*global Backbone, _ */
    Backbone.decorators || (Backbone.decorators = {});
    Backbone.decorators.Command = {
        command: Backbone.Radio.command.bind(Backbone.Radio, 'global'),
    
        comply: Backbone.Radio.comply.bind(Backbone.Radio, 'global'),
    
        complyOnce: Backbone.Radio.complyOnce.bind(Backbone.Radio, 'global'),
    
        stopComplying: Backbone.Radio.stopComplying.bind(Backbone.Radio, 'global'),
    
        channel: Backbone.Radio.channel
    };
    /*global Backbone, _ */
    (function () {
    
        Backbone.mediator = function () {};
    
        _.extend(Backbone.mediator.prototype, Backbone.decorators.PubSub, Backbone.decorators.RequestResponse, Backbone.decorators.Command);
    
        Backbone.mediator = new Backbone.mediator();
        Backbone.utils.readonly(Backbone.mediator, 'subscibe', 'subscibeOnce', 'unsubscribe', 'publish');
    
    })();
    
    
    
    var oldCollectionFetch = Backbone.Collection.prototype.fetch;
    Backbone.Collection.prototype.fetch = (function (options) {
        options = options || {};
        if (options.success || options.error || !Backbone.$) {
            return oldCollectionFetch.call(this, options);
        }
    
        var promise = Backbone.$.Deferred(),
            resolve, reject;
    
        resolve = function () {
            this.off('sync', resolve);
            this.off('error', reject);
            promise.resolve.apply(this, arguments);
        };
    
        reject = function () {
            this.off('sync', resolve);
            this.off('error', reject);
            promise.reject.apply(this, arguments);
        };
    
        this.once('sync', resolve.bind(this));
        this.once('error', reject.bind(this));
    
        if (!this.isFetching) {
            options.success = options.error = function () {
                this.isFetching = false;
            }.bind(this);
    
            this.isFetching = true;
            this.xhr = oldCollectionFetch.call(this, options);
        }
    
        return promise;
    });
    
    
    Backbone.Collection.prototype.sync = (function () {
        delete this.xhr;
        return Backbone.sync.apply(this, arguments);
    });
    Backbone.Collection.prototype.abort = (function () {
        if (this.xhr) {
            this.xhr.abort();
        }
    });
    var oldFetch = Backbone.Model.prototype.fetch;
    Backbone.Model.prototype.fetch = (function (options) {
        options = options || {};
        if (options.success || options.error || !Backbone.$) {
            return oldFetch.call(this, options);
        }
    
        var promise = Backbone.$.Deferred(),
            resolve, reject;
    
        resolve = function () {
            this.off('sync', resolve);
            this.off('error', reject);
            promise.resolve.apply(this, arguments);
        };
    
        reject = function () {
            this.off('sync', resolve);
            this.off('error', reject);
            promise.reject.apply(this, arguments);
        };
    
        this.once('sync', resolve.bind(this));
        this.once('error', reject.bind(this));
    
        if (!this.isFetching) {
            options.success = options.error = function () {
                this.isFetching = false;
            }.bind(this);
    
            this.isFetching = true;
            this.xhr = oldFetch.call(this, options);
        }
    
        return promise;
    });
    var oldSave = Backbone.Model.prototype.save;
    Backbone.Model.prototype.save = (function (key, val, options) {
        options = options || {};
        if (options.success || options.error || !Backbone.$) {
            return oldSave.call(this, key, val, options);
        }
    
        var promise = Backbone.$.Deferred();
        options.success = promise.resolve;
        options.error = promise.reject;
    
        oldSave.call(this, key, val, options);
    
        return promise;
    });
    
    
    
    Backbone.Model.prototype.sync = (function () {
        delete this.xhr;
        return Backbone.sync.apply(this, arguments);
    });
    Backbone.Model.prototype.abort = (function () {
        if (this.xhr) {
            this.xhr.abort();
        }
    });
    Backbone.Router.prototype.execute = function(callback, args) {
        Backbone.history.trigger('pre-route', args);
        this.trigger('pre-route', args);
    
        if (callback) callback.apply(this, args);
    
        Backbone.history.trigger('post-route', args);
        this.trigger('post-route', args);
    };
    var oldCtor = Backbone.View.prototype.constructor;
    Backbone.View = Backbone.View.extend({
       constructor: function (options) {
           options || (options = {});
           var optionNames = ['region', 'regions', 'name'].concat(this.optionNames || []);
           ​_.extend(this, _​.pick(options, optionNames));
    
           this.subscribeToEvents();
           this.isAppended = false;
    
           oldCtor.call(this, options);
       }
    });
    /**
     * Renders and appends the passed View to the Views element. The appended views is also registered as a subview.
     * Triggers a 'appended' event on the subview.
     *
     * <code>
     * Backbone.View.extend({
     *   render: function () {
     *       this.append(new SubView(), {
     *           region: '.my-region',
     *           render: true,
     *           replace: true,
     *           name: 'my-subview',
     *           addMethod: 'append'
     *       });
     *   }
     * });
     * </code>
     *
     * @param view {Backbone.View} The view to append this view
     * @param options {Object} Optional options object
     * @url https://github.com/rickekelschot/backbone-patterns/blob/master/README.md#appendview--options
     */
    
    Backbone.View.prototype.append = function (view, options) {
        options = _.defaults(options || {}, {
            render: true,
            replace: false,
            addMethod: 'append'
        });
    
        if (!(view instanceof Backbone.View)) {
            throw new Error('View is not a instance of Backbone.View')
        }
    
        var region = options.region || view.region,
            viewName = options.name || view.cid,
            $container = region;
    
        if (!(region instanceof jQuery)) {
            $container = this.$(region)[0] ? this.$(region) : this.$el;
        }
    
        if (options.render) {
            view.render();
        }
    
    
        $container[options.addMethod](view.$el);
    
        view.isAppended = true;
        view.trigger('appended');
    
        if (options.replace && this.subview(viewName)) {
            this.removeSubview(viewName);
        }
        this.subview(viewName, view);
    };
    
    Backbone.View.prototype.prepend = function (view, options) {
        options = options || {};
        options.addMethod = 'prepend';
        this.append(view, options);
    };
    /*global Backbone, _ */
    
    _.extend(Backbone.View.prototype, Backbone.decorators.PubSub, Backbone.decorators.RequestResponse, Backbone.decorators.Command);
    Backbone.View.prototype.renderMethod = 'html'; //append, replace, prepend
    Backbone.View.prototype.templateEngine = 'dust'; //dust
    
    Backbone.View.prototype.render = (function () {
        if (this.templateEngine !== null && typeof this.template !== 'function') {
            throw Error('Template is not a function!');
        }
        var appendView = (function (element) {
            var $oldEl;
            if (this.$el) {
                $oldEl = this.$el;
            }
    
            switch (this.renderMethod) {
            case 'replace':
                this.removeSubviews();
                this.setElement(element, true);
                if ($oldEl) {
                    $oldEl.replaceWith(this.$el);
                }
                break;
    
            case 'html':
                this.removeSubviews();
                this.$el.html(
                    $(element).html()
                );
                break;
    
            default:
                this.$el[this.renderMethod](
                    element
                );
            }
    
            this.trigger('render-complete');
        }.bind(this));
    
        if (this.templateEngine === 'dust') {
            this.template(this.getTemplateData(), function (err, out) {
                if (err) {
                    console.error(err);
                }
                appendView(out);
            });
        } else if (this.templateEngine !== null) {
            appendView(this.template(this.getTemplateData()));
        }
    
        return this;
    });
    
    Backbone.View.prototype.getTemplateData = (function () {
        if (this.model) {
            return this.model.toJSON();
        }
        return null;
    });
    
    Backbone.View.prototype.parseSubscriptions = (function (doSubscribe) {
        if (typeof this.subscriptions !== 'undefined') {
            _.each(this.subscriptions, function (events, channel) {
                if (_.isObject(events)) {
                    _.each(events, function (handler, event) {
                        if (typeof this[handler] === 'function') {
                            if (doSubscribe) {
                                this.channel(channel).subscribe(event, this[handler], this);
                            } else {
                                this.channel(channel).unsubscribe(event, this[handler], this);
                            }
                        }
                    }.bind(this));
                } else if (typeof this[events] === 'function') {
                    //Legacy, for old notation
                    if (doSubscribe) {
                        this.subscribe(channel, this[events], this);
                    } else {
                        this.unsubscribe(channel, this[events], this);
                    }
                }
            }.bind(this));
        }
    });
    
    Backbone.View.prototype.subscribeToEvents = (function () {
        this.parseSubscriptions(true);
    });
    
    Backbone.View.prototype.unSubscribeToEvents = (function () {
        this.parseSubscriptions(false);
    });
    
    Backbone.View.prototype.subview = function (name, instance) {
        if (typeof name === 'undefined') {
            throw new Error('Subview name is not defined');
        }
    
        this.subviews = this.subviews || {};
    
        if (typeof instance === 'undefined') {
            return this.subviews[name];
        }
    
        if (this.subviews[name]) {
            throw new Error('A subview with name: ' + name + ' already exists. Call removeSubview before adding it.');
        }
    
        this.listenTo(instance, 'removed', this.onSubviewRemoved);
    
        this.subviews[name] = instance;
        return this.subviews[name];
    };
    
    Backbone.View.prototype.onSubviewRemoved = function (view) {
        var viewName;
    
        _.each(this.subviews, function (subview, key) {
            if (view === subview) {
                viewName = key;
            }
        });
    
        if (viewName) {
            delete this.subviews[viewName];
            this.trigger('subview-removed', viewName);
        }
    }
    
    Backbone.View.prototype.removeSubview = function (name) {
        if (this.subviews[name]) {
            this.subviews[name].remove();
            delete this.subviews[name];
        }
    }
    
    Backbone.View.prototype.removeSubviews = function () {
        _.invoke(this.subviews, 'remove');
        this.subviews = {};
    }
    Backbone.View.prototype.remove = (function () {
        if (!this.disposed) {
            this.unSubscribeToEvents();
            this.removeSubviews();
            this.isAppended = false;
            this.trigger('removed', this);
    
            this.$el.remove();
            this.stopListening();
    
            this.dispose();
        }
    });
    
    Backbone.View.prototype.dispose = (function () {
        var dispose = _.keys(this);
    
        _.each(dispose, function (key) {
            delete this[key];
        }.bind(this));
    
        this.disposed = true;
        Backbone.utils.readonly(this);
    });
    Backbone.Class = function (options) {
      options = options || {};
    
      _.extend(this, _.pick(options, this.optionNames || {}));
    
      this.initialize.apply(this, arguments);
    };
    
    Backbone.Class.prototype.initialize = function () {};
    
    Backbone.Class.extend = Backbone.View.extend;

    return Backbone;
}));
