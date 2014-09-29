var oldProto = Backbone.View.prototype,
    extend = Backbone.View.extend,
    ctor = Backbone.View;

Backbone.View = function (options) {
    options || (options = {});
    if (this.optionNames) {
        _.extend(this, _.pick(options, this.optionNames));
    }

    ctor.apply(this, arguments);
    this._subscribeToEvents();
};

Backbone.View.prototype = oldProto;
Backbone.View.extend = extend;
