# Backbone Patterns
Backbone Patterns is a library intended to super charge your Backbone application. This is a library and not a framework, 
it will not provide code structuring of any kind.
 
## What does it do?
- [It provides messaging channels, courtesy of Backbone.Radio](#backboneradio)
- [Handles view lifecycle management](#viewlifecyclemanagement)
- [Command, PubSub & Request/Reply](#commandpubsubrequestreply)
- [Supercharged Backbone.View's](#superchargedbackboneviews)

## Backbone.Radio
Backbone Patterns utilizes Backbone.Radio from the MarionetteJS team. [Backbone.Radio documentation](https://github.com/marionettejs/backbone.radio)

## View lifecycle management
With plain 'ol Backbone managing your views is something you need to handle yourself. Leaving views "dangling" might cause
some serious memory leaks. We fixed this problem by allowing you to register a subview within your parent View. Calling view.remove()
on your parent View triggers the remove() function on all registered subviews.

We also improved the remove function. All the references stored inside a View are deleted, making it easier to GC (Garbage Collect).

## Command, PubSub & Request/Reply
Design patterns are the heart of every well written application. The Command, PubSub & Request/Reply patterns are deeply 
integrated within Backbone Patterns. See the API section for more information

## Supercharged Backbone.Views
We added some extra functions to the default Backbone.View, making it more robust and easier to use in larger projects.

## API
- [Backbone.View](#backboneview)
  - [append](#append)
  - [channel](#channel)
  - [prepend](#prepend)
  - [template](#template)
    
 
## Backbone.View
### append(view [, options])
Renders and appends the passed View to the Views element. The appended views is also registered as a subview.
Triggers a 'appended' event on the subview.

```js
Backbone.View.extend({
    render: function () {
        this.append(new SubView(), {
            region: '.my-region',
            render: true,
            replace: true,
            name: 'my-subview',
            addMethod: 'append'
        });
    }
});
```

- [options.region](#optionsregion)
- [options.render](#optionsrender)
- [options.replace](#optionsreplace)
- [options.name](#optionsname)
- [options.addMethod](#optionsaddmethod)

#### options.region
*Default is the root of the parent view.* 

##### Supported values
- QuerySelector
- DOM element
- jQuery element

#### options.render (Boolean)
*Default is true.* 
Passing false will not call the render() function on the subview

#### options.replace (Boolean)
*Default is false.* 
If you try to append a subview with a name that is already registered a Error is thrown.
Passing true will overwrite (and remove) a already registered subview with the same name.

#### options.name (String)
*Default is the views cid.* 

#### options.addMethod (String)
*Default is 'append'*
You can overwrite the method used to append the subview. 


### channel(name)
Returns a [Backbone.Radio.Channel](https://github.com/marionettejs/backbone.radio/tree/v0.9.0#channels)

```js
Backbone.View.extend({
    intialize: function () {
        this.channel('my-channel').request('user');
    }
});
```

##### Provides a interface to
- [Backbone.Radio.Commands](https://github.com/marionettejs/backbone.radio/tree/v0.9.0#backboneradiocommands)
- [Backbone.Radio.Requests](https://github.com/marionettejs/backbone.radio/blob/master/README.md#requests)

### prepend(view [, options])
Similar to [append()](#append) but prepends instead of appending. See [append()](#append) for more info.

### template
The template which needs to be rendered by the view. 

```js
Backbone.View.extend({
    template: _.template("hello: <%= name %>")
});
```