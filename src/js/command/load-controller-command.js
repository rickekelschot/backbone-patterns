/*global Backbone, _ */

Backbone.LoadControllerCommand = Backbone.Command.extend({

    optionNames: Backbone.Command.prototype.optionNames.concat(['controllerName']),

    execute: function () {
        if (typeof window[controllerName] === 'undefined') {
            this.promise.reject();
        } else {
            this.promise.resolveWith(window[controllerName]);
        }

        return Backbone.Command.prototype.execute.call(this);
    }

});

