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
