Backbone.View.prototype.remove = (function () {
    if (!this.disposed) {
        this.unSubscribeToEvents();
        this.removeSubviews();
        this.isAppended = false;
        this.isAddedToDOM = false;
        this.trigger('removed', this);
        this.trigger('removed-from-dom', this);

        this.$el.remove();
        this.stopListening();

        this.dispose();
    }
});
