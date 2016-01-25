var oldCtor = Backbone.View.prototype.constructor;

Backbone.View = Backbone.View.extend({
    constructor: function (options) {
        options || (options = {});
        //We also pick model & collection here because it can be used in className functions
        var optionNames = ['region', 'regions', 'name', 'persistentClassName', 'model', 'collection', 'className'].concat(this.optionNames || []);

        _.extend(this, _.pick(options, optionNames));

        this.subscribeToEvents();
        this.isAppended = false;
        this.isAddedToDOM = false;

        oldCtor.call(this, options);
    }
});