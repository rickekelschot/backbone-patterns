Backbone.View.prototype.remove = (function () {
    if (!this.disposed) {
        this.unSubscribeToEvents();
        this.removeSubviews();
        this.isAppended = false;
        this.trigger('removed');

        this.$el.remove();
        this.stopListening();

        this.dispose();
    }
});
