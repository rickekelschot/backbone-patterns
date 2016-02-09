Backbone.View.prototype.renderMethod = 'html'; //append, replace, prepend
Backbone.View.prototype.templateEngine = 'dust'; //dust

Backbone.View.prototype.render = (function () {
    var appendView = (function (element) {
        var $oldEl;
        if (this.$el) {
            $oldEl = this.$el;
        }

        switch (this.renderMethod) {
        case 'replace':
            this.removeSubviews();
            this.setElement(element, true);
            if ($oldEl) {
                $oldEl.replaceWith(this.$el);
            }
            break;

        case 'html':
            this.removeSubviews();
            this.$el.html(
                $(element).html()
            );
            break;

        default:
            this.$el[this.renderMethod](
                element
            );
        }

        this.trigger('render-complete');
    }.bind(this));

	if (typeof this.template !== 'undefined') {
	    if (typeof this.template !== 'function') {
	        throw Error('Template is not a function!');
	    }
	    if (this.templateEngine === 'dust') {
	        this.template(this.getTemplateData(), function (err, out) {
	            if (err) {
	                console.error(err);
	            }
	            appendView(out);
	        });
	    } else {
	        appendView(this.template(this.getTemplateData()));
	    }
	}
	
    return this;
});

Backbone.View.prototype.getTemplateData = (function () {
    if (this.model) {
        return this.model.toJSON();
    }
    return null;
});
