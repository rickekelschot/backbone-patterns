Backbone.View.prototype.renderMethod = "append"; //append, replace, prepend
Backbone.View.prototype.templateEngine = "dust"; //dust

Backbone.View.prototype.render = (function () {
    if (typeof this.template !== 'function') {
        throw Error('Template is not a function!');
    }
    var appendView = (function (element) {
            if (this.renderMethod === 'replace') {
                this.$el = $(element);
            } else {
                this.$el[this.renderMethod](
                    element
                );
            }
        }.bind(this));

    if (this.templateEngine === 'dust') {
        this.template(this.getTemplateData(), function (err, out) {
            appendView(out);
        });
    } else {
        appendView(this.template(this.getTemplateData()));
    }
});

Backbone.View.prototype.getTemplateData = (function () {
    return null;
});
