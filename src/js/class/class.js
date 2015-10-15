Backbone.Class = function (options) {
  options = options || {};

  _.extend(this, _.pick(options, this.optionNames || {}));

  this.initialize.apply(this, arguments);
};

Backbone.Class.prototype.initialize = function () {};

Backbone.Class.extend = Backbone.View.extend;