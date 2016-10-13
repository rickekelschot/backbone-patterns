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
