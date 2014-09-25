var View = Backbone.View.extend({
    initialize: function () {
        this.subscribe('test-event', function () {
            console.log('trigger!!');
        });

        this.setResponder('test', function () {
            return {msg: 'response!!'};
        }, this);
    }
});

new View();


var View2 = Backbone.View.extend({
    initialize: function () {
        this.publish('test-event');
        var obj = this.request('test');
        console.log(this.request('test', 'asdasdsd'));
    }
});

new View2();