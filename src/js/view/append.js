/**
 * Renders and appends the passed View to the Views element. The appended views is also registered as a subview.
 * Triggers a 'appended' event on the subview.
 *
 * <code>
 * Backbone.View.extend({
 *   render: function () {
 *       this.append(new SubView(), {
 *           region: '.my-region',
 *           render: true,
 *           replace: true,
 *           name: 'my-subview',
 *           addMethod: 'append'
 *       });
 *   }
 * });
 * </code>
 *
 * @param view {Backbone.View} The view to append this view
 * @param options {Object} Optional options object
 * @url https://github.com/rickekelschot/backbone-patterns/blob/master/README.md#appendview--options
 */

Backbone.View.prototype.append = function (view, options) {
    options = _.defaults(options || {}, {
        render: true,
        replace: false,
        addMethod: 'append'
    });

    if (!(view instanceof Backbone.View)) {
        throw new Error('View is not a instance of Backbone.View')
    }

    var region = options.region || view.region,
        viewName = options.name || view.cid,
        $container = region;

    if (!(region instanceof jQuery)) {
        $container = this.$(region)[0] ? this.$(region) : this.$el;
    }

    if (options.render) {
        view.render();
    }


    $container[options.addMethod](view.$el);

    view.isAppended = true;
    view.trigger('appended');

    if (this.isAddedToDOM) {
        view.addedToDOM();
    }

    if (options.replace && this.subview(viewName)) {
        this.removeSubview(viewName);
    }
    this.subview(viewName, view);
};
