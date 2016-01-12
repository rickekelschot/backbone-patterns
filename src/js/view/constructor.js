var oldCtor = Backbone.View.prototype.constructor;
Backbone.View = Backbone.View.extend({
   constructor: function (options) {
       options || (options = {});
       var optionNames = ['region', 'regions', 'name'].concat(this.optionNames || []);
       ​_.extend(this, _​.pick(options, optionNames));

       this.subscribeToEvents();
       this.isAppended = false;

       oldCtor.call(this, options);
   }
});