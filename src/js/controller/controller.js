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