var oldSetAttributes = Backbone.View.prototype._setAttributes;
Backbone.View.prototype._setAttributes = function(attributes) {
    this.setClassName(attributes.class);
    delete attributes.class;

    oldSetAttributes.call(this, attributes);
};