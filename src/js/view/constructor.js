var oldProto = Backbone.View.prototype,
    extend = Backbone.View.extend,
    ctor = Backbone.View;

Backbone.View = function (options) {
    options || (options = {});
    var optionNames = ['region', 'regions', 'name', 'componentModel'].concat(this.optionNames || []);
    _.extend(this, _.pick(options, optionNames));
    ctor.apply(this, arguments);
    this._subscribeToEvents();
    this.isAppended = false;
};

Backbone.View.prototype = oldProto;
Backbone.View.extend = extend;
