Backbone.View.prototype.addedToDOM = function () {
    this.isAddedToDOM = true;

    _.each(this.subviews, function (subview) {
        if (subview.hasOwnProperty('addedToDOM')) {
            subview.addedToDOM();
        }
    });

    this.trigger('added-to-dom');
};
