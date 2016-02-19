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