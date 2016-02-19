/**
 * Helper util to delegate or undelegate View events
 *
 * @param events
 * @param context
 * @param remove
 */

var viewEventDelegation = function (events, context, remove) {
    var action = remove ? 'stopListening' : 'listenTo';
    for (var key in events) {
        var method = events[key];

        if (!_.isFunction(method)) method = context[method];
        if (!method) continue;
        context[action](context, key, method);
    }
};
