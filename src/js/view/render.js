Backbone.View.prototype.renderMethod = "append"; //append, replace, prepend
Backbone.View.prototype.renderType = "callback"; //callback or return

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

    if (this.renderType === 'return') {
        appendView(this.template(this.getTemplateData()));
    } else {
         this.template(this.getTemplateData(), function (out) {
             appendView(out);
         });
    }
});

Backbone.View.prototype.getTemplateData = (function () {
    return null;
});
