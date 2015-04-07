Backbone.Model.prototype.abort = (function () {
    if (this.xhr) {
        this.xhr.abort();
    }
});