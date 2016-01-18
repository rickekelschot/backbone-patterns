var oldCtor = Backbone.View.prototype.constructor,
    createClassName = function (persistentClassName, className) {
        var combindedClassName = '';
        combindedClassName += persistentClassName || '';
        combindedClassName += ' ';
        combindedClassName += className || '';

        //trim leading & trailing spaces
        return combindedClassName.replace(/^\s+|\s+$/g, '');
    };

Backbone.View = Backbone.View.extend({
    constructor: function (options) {
        options || (options = {});
        //We also pick model & collection here because it can be used in className functions
        var optionNames = ['region', 'regions', 'name', 'persistentClassName', 'model', 'collection'].concat(this.optionNames || []);

        _.extend(this, _.pick(options, optionNames));

        this.subscribeToEvents();
        this.isAppended = false;

        options.className = createClassName(_.result(this, 'persistentClassName'), _.result(options, 'className') || _.result(this, 'className'));

        oldCtor.call(this, options);
    }
});