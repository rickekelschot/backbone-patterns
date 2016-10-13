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

