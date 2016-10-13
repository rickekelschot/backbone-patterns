Backbone.Class = function (options) {
    options = options || {};

    _.extend(this, _.pick(options, this.optionNames || {}));
  
    this.initialize.apply(this, arguments);

    return this;
};

_.extend(Backbone.Class.prototype, Backbone.Events);

Backbone.Class.prototype.initialize = function () {
};

Backbone.Class.extend = Backbone.View.extend;