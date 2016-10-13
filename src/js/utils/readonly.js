Backbone.utils = Backbone.utils || {};
Backbone.utils.readonly = (function (obj) {
    var descriptor;
    if (typeof Object.defineProperty !== "undefined") {
        descriptor = {
            writable: false,
            enumerable: true,
            configurable: false
        };

        var props = (arguments.length > 1) ? _.toArray(arguments).slice(1) : [];
        _.each(props, function (prop) {
            descriptor.value = obj[prop];
            try {
                Object.defineProperty(obj, prop, descriptor);
            } catch (error) {}
        });
        return true;
    }

    return false;
});