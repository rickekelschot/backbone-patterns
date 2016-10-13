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

    Backbone.Class = function (options) {
        options = options || {};
    
        _.extend(this, _.pick(options, this.optionNames || {}));
      
        this.initialize.apply(this, arguments);
    
        return this;
    };
    
    _.extend(Backbone.Class.prototype, Backbone.Events);
    
    Backbone.Class.prototype.initialize = function () {
    };
    
    Backbone.Class.extend = Backbone.View.extend;
    Backbone.Radio.Channel.prototype.subscribe = Backbone.Radio.Channel.prototype.on;
    Backbone.Radio.Channel.prototype.subscribeOnce = Backbone.Radio.Channel.prototype.once;
    Backbone.Radio.Channel.prototype.unsubscribe = Backbone.Radio.Channel.prototype.off;
    Backbone.Radio.Channel.prototype.publish = Backbone.Radio.Channel.prototype.trigger;
    
    Backbone.utils = Backbone.utils || {};
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
    Backbone.utils = Backbone.utils || {};
    Backbone.utils.loadModule = (function () {
        var define, enqueue, require;
    
        define = window.define;
        require = window.require;
        if (typeof define === 'function' && define.amd) {
            return function (moduleName, handler) {
                handler(require(moduleName));
            };
        } else {
            enqueue = typeof setImmediate !== "undefined" && setImmediate !== null ? setImmediate : setTimeout;
            return function (moduleName, handler) {
                return enqueue(function () {
                    return handler(require(moduleName));
                });
            };
        }
    })();
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
    
    Backbone.Command = Backbone.Class.extend({
    
        optionNames: ['onComplete', 'onError'],
    
        promise: null,
        resolve: null,
        reject: null,
    
        constructor: function () {
            Backbone.Class.prototype.apply(this, arguments);
            this.promise = Backbone.$.Deferred();
            _.bindAll(this, 'complete', 'error');
        },
    
        execute: function () {
            return this.promise;
        },
    
        complete: function () {
            if (_.isFunction(this.resolve)) {
                if (_.isFunction(this.onComplete)) {
                    this.onComplete(arguments);
                }
                this.promise.resolve.apply(this, arguments);
                this.dispose();
            }
        },
    
        error: function () {
            if (_.isFunction(this.reject)) {
                if (_.isFunction(this.onError)) {
                    this.onError(arguments);
                }
                this.promise.reject.apply(this, arguments);
                this.dispose();
            }
        },
    
        disposed: false,
    
        dispose: function () {
            // if (this.disposed) {
            //     return;
            // }
            //
            // var obj, prop,
            //     hasProp = {}.hasOwnProperty;
            //
            // for (prop in this) {
            //     if (!hasProp.call(this, prop)) continue;
            //     obj = this[prop];
            //     if (!(obj && typeof obj.dispose === 'function')) {
            //         continue;
            //     }
            //     obj.dispose();
            //     delete this[prop];
            // }
            //
            // this.disposed = true;
            // if (typeof Object.freeze === "function") {
            //     Object.freeze(this);
            // }
        }
    
    }, Backbone.decorators.RequestResponse, Backbone.Events);
    
    
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
    Backbone.History.ROUTE_CHANGE = 'history:route:change';
    Backbone.History.ROUTE_REJECTED = 'history:route:rejected';
    Backbone.History.ROUTE_RESOLVED = 'history:route:resolved';
    
    _.extend(Backbone.History.prototype, {
    
        storeRouteRequest: function(fragment, options) {
            var promise = Backbone.$.Deferred();
    
            promise
                .then(this.resolveRoute.bind(this, fragment, options),
                    this.rejectRoute.bind(this, fragment, options));
    
            this.pendingRoute = {
                route: {
                    fragment: fragment,
                    options: options
                },
                promise: promise
            };
        },
    
        getPendingRoute: function () {
            return this.pendingRoute;
        },
    
        resolveRoute: function (fragment, options) {
            delete this.pendingRoute;
            this.fragment = fragment;
    
            // If pushState is available, we use it to set the fragment as a real URL.
            if (this._usePushState) {
                this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
    
                // If hash changes haven't been explicitly disabled, update the hash
                // fragment to store history.
            } else if (this._wantsHashChange) {
                this._updateHash(this.location, fragment, options.replace);
                if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
                    var iWindow = this.iframe.contentWindow;
    
                    // Opening and closing the iframe tricks IE7 and earlier to push a
                    // history entry on hash-tag change.  When replace is true, we don't
                    // want this.
                    if (!options.replace) {
                        iWindow.document.open();
                        iWindow.document.close();
                    }
    
                    this._updateHash(iWindow.location, fragment, options.replace);
                }
    
                // If you've told us that you explicitly don't want fallback hashchange-
                // based history, then `navigate` becomes a page refresh.
            } else {
                this.location.assign(url);
            }
    
            Backbone.mediator.publish(Backbone.History.ROUTE_RESOLVED, fragment, options);
        },
    
        rejectRoute: function (fragment, options) {
            Backbone.mediator.publish(Backbone.History.ROUTE_REJECTED, fragment, options);
        },
    
        //TODO: build check if there is already an open pending route
    
        navigate: function (fragment, options) {
            if (!Backbone.History.started) return false;
            if (!options || options === true) options = {trigger: !!options};
    
            // Normalize the fragment.
            fragment = this.getFragment(fragment || '');
    
            // Don't include a trailing slash on the root.
            var rootPath = this.root;
            if (fragment === '' || fragment.charAt(0) === '?') {
                rootPath = rootPath.slice(0, -1) || '/';
            }
            var url = rootPath + fragment;
    
            // Strip the hash and decode for matching.
            fragment = this.decodeFragment(fragment.replace(/#.*$/, ''));
    
            if (this.fragment === fragment) return;
    
            this.storeRouteRequest(fragment, options);
    
            if (!options.trigger) {
                this.getPendingRoute().promise.resolve();
            } else {
                Backbone.mediator.publish(Backbone.History.ROUTE_CHANGE);
            }
        },
    
        dispose: function () {
            delete this.handlers;
            Backbone.History.started = false;
        }
    });
    
    
    /*global Backbone, _, require */
    (function () {
    
        'use strict';
    
        Backbone.Route = Backbone.Class.extend({
    
            escapeRegExp: /[\-{}\[\]+?.,\\\^$|#\s]/g,
            optionalRegExp: /\((.*?)\)/g,
            paramRegExp: /(?::|\*)(\w+)/g,
    
    
            initialize: function (route, options) {
                this.options = _.extend({}, options);
    
                if (this.options.name) {
                    this.name = this.options.name;
                }
    
                this.allParams = [];
                this.requiredParams = [];
                this.optionalParams = [];
    
                this.route = route;
    
                Object.freeze(this);
            },
    
            isMatch: function (route) {
                console.log('route:isMatch', this.route);
            },
    
            isSubroute: function () {
                return false;
            },
    
            getControllerName: function () {
                return this.route;
            },
    
            createRegExp: function () {
                var pattern = this.route.path.replace(this.escapeRegExp, '\\$&');
    
                this.replaceParams(pattern, function (match, param) {
                    return this.allParams.push(param);
                }.bind(this));
    
                pattern = pattern.replace(optionalRegExp, this.parseOptionalPortion);
                pattern = this.replaceParams(pattern, function (match, param) {
                    this.requiredParams.push(param);
                    return this.paramCapturePattern(match);
                }.bind(this));
    
                return this.regExp = RegExp("^" + pattern + "(?=\\/*(?=\\?|$))");
            },
    
            replaceParams: function(string, callback) {
                return string.replace(paramRegExp, callback);
            }
    
        });
    })();
    
    Backbone.Router.prototype.execute = function(callback, args) {
        Backbone.history.trigger('pre-route', args);
        this.trigger('pre-route', args);
    
        if (callback) callback.apply(this, args);
    
        Backbone.history.trigger('post-route', args);
        this.trigger('post-route', args);
    };
    /*global Backbone, _, require */
    (function () {
    
        'use strict';
    
        Backbone.Router = Backbone.Router.extend({
    
            _routes: [],
    
            activeRoute: null,
            activeInstance: null,
    
            initialize: function (prefix, options) {
                options = options || {};
                _.each(this.routes, function (route, path) {
                    this._routes.push(new Backbone.Route({
                        handler: route,
                        path: path
                    }));
                }.bind(this));
    
                if (options.subrouter !== true) {
                    Backbone.mediator.subscribe('history:route:change', this.processRoute.bind(this));
                }
    
            },
    
            processRoute: function () {
                var pendingRoute = Backbone.history.getPendingRoute(),
                    match = this.matchRoute(pendingRoute.route);
    
                console.log('MATCH!!!', this.routes);
    
                if (!match) {
                    pendingRoute.promise.reject();
                } else {
                    if (match.isSubroute()) {
                        if (this.isActiveSubroute(match)) {
                            this.activeInstance.processRoute();
                        } else {
                            // load new router via command and execute
                        }
                    } else {
                        if (this.isActiveController(match)) {
                            this.activeInstance.processRoute(match)
                                .then(pendingRoute.promise.resolve, pendingRoute.promise.reject);
                        } else {
                            console.log('Executing controller', match.getControllerName);
                            this.executeCommand(Backbone.LoadControllerCommand, {
                                controllerName: match.getControllerName
                            }).then(function () {
                                console.log(arguments);
                            });
                        }
    
                    }
                }
            },
    
            executeCommand: function (Command, options) {
                var command = new Command(options);
                return command.execute();
            },
    
            matchRoute: function (route) {
                var matchedRoute;
    
                this._routes.forEach(function (_route) {
                    if (_route.isMatch(route)) {
                        matchedRoute = _route;
                    }
                });
    
                return matchedRoute;
            },
    
            isActiveSubroute: function (match) {
                if (!this.activeInstance || !(this.activeInstance instanceof Backbone.Router)) {
                    return false;
                }
            },
    
            isActiveController: function (match) {
                if (!this.activeInstance || !(this.activeInstance instanceof Backbone.Controller)) {
                    return false;
                }
            },
    
            // navigate: function (route, options) {
            //     if (route.substr(0, 1) != '/' &&
            //         route.indexOf(this.prefix.substr(0, this.prefix.length - 1)) !== 0) {
            //
            //         route = this.prefix +
            //             (route ? this.separator : "") +
            //             route;
            //     }
            //     Backbone.Router.prototype.navigate.call(this, route, options);
            // },
    
            // route: function (route, controllerAction) {
            //     // strip off any leading slashes in the sub-route path,
            //     // since we already handle inserting them when needed.
            //     if (route.substr(0) === "/") {
            //         route = route.substr(1, route.length);
            //     }
            //
            //     var _route = this.prefix;
            //     if (route && route.length > 0) {
            //         if (this.prefix.length > 0)
            //             _route += this.separator;
            //
            //         _route += route;
            //     }
            //
            //     // remove the un-prefixed route from our routes hash
            //     delete this.routes[route];
            //
            //     // add the prefixed-route.  note that this routes hash is just provided
            //     // for informational and debugging purposes and is not used by the actual routing code.
            //     this.routes[_route] = controllerAction;
            //
            //     // delegate the creation of the properly-prefixed route to Backbone
            //     return Backbone.Router.prototype.route.call(this, _route, controllerAction, controllerAction);
            // },
    
            // loadController: function (controllerName, handler) {
            //     var controller = controllerName.replace(/[A-Z]/g, function (g) {
            //             return '-' + g[1].toLowerCase();
            //         }),
            //         moduleName = this.controllerPath + controller;
            //
            //     return Backbone.utils.loadModule(moduleName, handler);
            // },
            //
            // executedAction: function (nextController, route) {
            //     this.currentController = nextController;
            //     Backbone.mediator.publish('route:resolved', route);
            // },
    
            // rejected: function (router, controllerName, route) {
            //     Backbone.mediator.publish('route:rejected', route);
            // },
    
            // execute: function (controllerAction, args) {
            //     var controller,
            //         action,
            //         route;
            //
            //     if (typeof controllerAction !== 'string') {
            //         throw 'should be a alkdjlaksjd';
            //     }
            //
            //     controller = controllerAction.split('#')[0];
            //     action = controllerAction.split('#')[1];
            //     route = {
            //         controller: controller,
            //         action: action
            //     };
            //
            //     if (this.currentRoute.controller !== controller) {
            //         return this.loadController(controller, function (Controller) {
            //             var nextController = new Controller();
            //             nextController.fireAction(action, args)
            //                 .then(this.executedAction.bind(this, nextController, route), this.rejected(this, controller, route));
            //         }.bind(this));
            //     }
            //
            //     this.currentController.fireAction(action, args)
            //         .then(this.executedAction.bind(this, this.currentController, route),
            //             this.rejected(this, controller, route));
            // }
        });
    })();
    
    /*global Backbone, _ */
    
    Backbone.Controller = Backbone.Class.extend({
    
        isPersistent: false,
    
        constructor: function () {
    
        },
    
        fireAction: function (actionName, routeParams) {
            var beforeAction = this['before' + actionName.substring(0, 1).toUpperCase() + actionName.substring(1)],
                action = this[actionName];
    
            return new Promise(function (resolve, reject) {
                if (typeof beforeAction === 'function') {
                    beforeAction.call(this, routeParams).then(function () {
                        action.call(this, routeParams);
                        resolve();
                    }.bind(this), function (error) {
                        reject(error);
                    });
                } else {
                    action.call(this, routeParams);
                    resolve();
                }
            }.bind(this));
        },
    
        disposed: false,
    
        dispose: function () {
            var prop;
    
            if (this.disposed) {
                return;
            }
    
            for (prop in this) {
                if (this.hasOwnProperty(prop)) {
                    delete this[prop];
                }
            }
    
            this.disposed = true;
            return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
        }
    });
    var oldCtor = Backbone.View.prototype.constructor;
    
    Backbone.View = Backbone.View.extend({
        constructor: function (options) {
            var optionNames = ['region', 'regions', 'name', 'persistentClassName', 'isAddedToDOM'].concat(this.optionNames || []);
    
            options || (options = {});
    
            _.extend(this, _.pick(options, optionNames));
            _.defaults(this, {
                isAppended: false,
                isAddedToDOM: false
            });
    
            this.subscribeToEvents();
    
            if (this.isAddedToDOM) {
                this.addedToDOM();
            }
    
            oldCtor.call(this, options);
        }
    });
    /**
     * Triggers a 'added-to-dom' event on it's children and on itself.
     * All subviews added after this view is added to DOM, will also have the addedToDOM function called.
     */
    Backbone.View.prototype.addedToDOM = function () {
        this.isAddedToDOM = true;
    
        _.each(this.subviews, function (subview) {
            if (typeof subview.addedToDOM === 'function') {
                subview.addedToDOM();
            }
        });
    
        this.trigger('added-to-dom');
    };
    
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
        view.parent = this;
        view.trigger('appended');
    
        if (this.isAddedToDOM) {
            view.addedToDOM();
        }
    
        if (options.replace && this.subview(viewName)) {
            this.removeSubview(viewName);
        }
        this.subview(viewName, view);
    };
    
    /**
     * Helper util to delegate or undelegate View events
     *
     * @param events
     * @param context
     * @param remove
     */
    
    var viewEventDelegation = function (events, context, remove) {
        var action = remove ? 'stopListening' : 'listenTo';
        for (var key in events) {
            var method = events[key];
    
            if (!_.isFunction(method)) method = context[method];
            if (!method) continue;
            context[action](context, key, method);
        }
    };
    
    /**
     * Delegate View events. These events are triggered by Backbone.Events API
     * @param events
     */
    
    Backbone.View.prototype.delegateViewEvents = function (events) {
        if (!events) return this;
        viewEventDelegation(events, this);
        return this;
    };
    
    /**
     * Extend delegateEvents with bubble and capture event logic
     * @param events
     */
    
    var oldDelegateEvents = Backbone.View.prototype.delegateEvents;
    Backbone.View.prototype.delegateEvents = function (events) {
        oldDelegateEvents.call(this, events);
    
        this.delegateViewEvents(_.result(this, 'bubble'));
        this.delegateViewEvents(_.result(this, 'capture'));
    
        return this;
    };
    
    /**
     * Delegate View events. These events are triggered by Backbone.Events API
     * @param events
     */
    
    Backbone.View.prototype.undelegateViewEvents = function (events) {
        if (!events) return this;
        viewEventDelegation(events, this, true);
        return this;
    };
    
    /**
     * Extend delegateEvents with bubble and capture event logic
     * @param events
     */
    
    var oldUndelegateEvents = Backbone.View.prototype.undelegateEvents;
    Backbone.View.prototype.undelegateEvents = function (events) {
        oldUndelegateEvents.call(this, events);
    
        this.undelegateViewEvents(_.result(this, 'bubble'));
        this.undelegateViewEvents(_.result(this, 'capture'));
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
    
    	if (this.template) {
    	    if (typeof this.template !== 'function') {
    	        throw Error('Template is not a function!');
    	    }
    	    if (this.templateEngine === 'dust') {
    	        this.template(this.getTemplateData(), function (err, out) {
    	            if (err) {
    	                console.error(err);
    	            }
    	            appendView(out);
    	        });
    	    } else {
    	        appendView(this.template(this.getTemplateData()));
    	    }
    	} else {
    		this.trigger('render-complete');
    	}
    	
        return this;
    });
    
    Backbone.View.prototype.getTemplateData = (function () {
        if (this.model) {
            return this.model.toJSON();
        }
        return null;
    });
    
    var oldSetAttributes = Backbone.View.prototype._setAttributes;
    Backbone.View.prototype._setAttributes = function(attributes) {
        this.setClassName(attributes.class);
        delete attributes.class;
    
        oldSetAttributes.call(this, attributes);
    };
    /**
     * Set the (combined) className on the element. Combines persistentClassName with className.
     */
    Backbone.View.prototype.setClassName = function (className) {
        className = className || _.result(this, 'className') || '';
    
        if (this.persistentClassName) {
            className = this.persistentClassName + ' ' + className;
        }
    
        this.el.className = className;
    };
    
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
    var oldRemove = Backbone.View.prototype.remove;
    Backbone.View.prototype.remove = function () {
        if (!this.disposed) {
            this.unSubscribeToEvents();
            this.removeSubviews();
            this.isAppended = false;
            this.isAddedToDOM = false;
            this.trigger('removed', this);
            this.trigger('removed-from-dom', this);
    
            this.$el.remove();
            this.stopListening();
    
            this.dispose();
        }
    };
    
    Backbone.View.prototype.dispose = (function () {
        var dispose = _.keys(this);
    
        _.each(dispose, function (key) {
            delete this[key];
        }.bind(this));
    
        this.disposed = true;
        Backbone.utils.readonly(this);
    });
    /**
     * Bubbles an event from the view to it's parents
     * @param name
     */
    
    Backbone.View.prototype.triggerBubble = function (name) {
        this.trigger.apply(this, arguments);
    
        if (this.parent instanceof Backbone.View && _.isFunction(this.parent.triggerBubble)) {
            this.parent.triggerBubble.apply(this.parent, arguments);
        }
    };
    
    /**
     * Capture an event from the view onto it's children
     * @param name
     */
    
    Backbone.View.prototype.triggerCapture = function (name) {
        this.trigger.apply(this, arguments);
    
        for (var key in this.subviews) {
            var subview = this.subviews[key];
            if (_.isFunction(subview.triggerCapture)) {
                subview.triggerCapture.apply(subview, arguments);
            }
        }
    };
    


    return Backbone;
}));
