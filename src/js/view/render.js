Backbone.View.prototype.renderMethod = "append"; //append, replace, prepend

Backbone.View.prototype.render = (function () {
    if (typeof this.template !== 'function') {
        throw Error('Template is not a function!');
    }

    if (this.renderMethod === 'replace') {
        this.$el = $(
            this.template(this.getTemplateData())
        );
    } else {
        this.$el[this.renderMethod](
            this.template(this.getTemplateData())
        );
    }
});

Backbone.View.prototype.getTemplateData = (function () {
    return null;
});
