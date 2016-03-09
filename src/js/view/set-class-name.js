/**
 * Set the (combined) className on the element. Combines persistentClassName with className.
 */
Backbone.View.prototype.setClassName = function (className) {
    className = className || _.result(this, 'className') || '';

    if (this.persistentClassName) {
        className = this.persistentClassName + ' ' + className;
    }

    this.el.className = className;
};
