Backbone.View.prototype.renderMethod = "append"; //append, replace, prepend
Backbone.View.prototype.templateEngine = "dust"; //dust

Backbone.View.prototype.render = (function () {
    if (typeof this.template !== 'function') {
        throw Error('Template is not a function!');
    }
    var appendView = (function (element) {
            if (this.renderMethod === 'replace') {
                if (this.$el) {
                    this.$el.replaceWith(element);
                }
                this.setElement(element);
            } else {
                this.$el[this.renderMethod](
                    element
                );
            }
            this.trigger('render-complete');
        }.bind(this));

    if (this.templateEngine === 'dust') {
        this.template(this.getTemplateData(), function (err, out) {
            appendView(out);
        });
    } else {
        appendView(this.template(this.getTemplateData()));
    }

    return this;
});

Backbone.View.prototype.getTemplateData = (function () {
    return null;
});
