var oldSetAttributes = Backbone.View.prototype._setAttributes;
Backbone.View.prototype._setAttributes = function(attributes) {
    if (this.persistentClassName) {
        attributes.class = attributes.class || '';
        attributes.class = (this.persistentClassName + ' ' + attributes.class).replace(/^\s+|\s+$/g, '');
    }

    oldSetAttributes.call(this, attributes);
};