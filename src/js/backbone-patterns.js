(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore'], function (Backbone, _) {
            return factory(Backbone, _);
        });
    }
    else if (typeof exports !== 'undefined') {
        var Backbone = require('backbone');
        var _ = require('underscore');
        module.exports = factory(Backbone, _);
    }
    else {
        factory(root.Backbone, root._);
    }
}(this, function (Backbone, _) {
    'use strict';

    // @include ../../bower_components/backbone.radio/src/backbone.radio.js
    // @include channel/channel.js
    // @include utils/readonly.js
    // @include decorators/pubsub.js
    // @include decorators/request-response.js
    // @include decorators/command.js
    // @include mediator/mediator.js
    // @include collection/fetch.js
    // @include collection/sync.js
    // @include collection/abort.js
    // @include model/fetch.js
    // @include model/save.js
    // @include model/sync.js
    // @include model/abort.js
    // @include router/execute.js
    // @include view/constructor.js
    // @include view/added-to-dom.js
    // @include view/append.js
    // @include view/bubble.js
    // @include view/capture.js
    // @include view/prepend.js
    // @include view/pubsub.js
    // @include view/render.js
    // @include view/set-attributes.js
    // @include view/subscriptions.js
    // @include view/subview.js
    // @include view/remove.js
    // @include view/dispose.js
    // @include class/class.js

    return Backbone;
}));
