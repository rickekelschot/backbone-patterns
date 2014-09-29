Backbone.Model.prototype.inspect = (function (attrs) {
    var results = this.inspectAttributes(attrs),
        matches = true;

    for (var key in attrs) {
        if (this.get(key) !== attrs[key]) {
            matches = false;
            break;
        }
    }

    if (matches) {
        results.push(this);
    }

    return results;
});

