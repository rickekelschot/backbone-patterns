/*global Backbone, _ */
(function () {

    Backbone.mediator = function () {};

    _.extend(Backbone.mediator.prototype, Backbone.decorators.PubSub, Backbone.decorators.RequestResponse, Backbone.decorators.Command);

    Backbone.mediator = new Backbone.mediator();
    Backbone.utils.readonly(Backbone.mediator, 'subscibe', 'subscibeOnce', 'unsubscribe', 'publish');

})();


