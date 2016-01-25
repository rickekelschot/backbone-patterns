/**
 * Triggers a 'added-to-dom' event on it's children and on itself.
 * All subviews added after this view is added to DOM, will also have the addedToDOM function called.
 */
Backbone.View.prototype.addedToDOM = function () {
    this.isAddedToDOM = true;

    _.each(this.subviews, function (subview) {
        if (subview.hasOwnProperty('addedToDOM')) {
            subview.addedToDOM();
        }
    });

    this.trigger('added-to-dom');
};
