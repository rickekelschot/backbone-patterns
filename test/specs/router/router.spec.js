define(function (require) {

    require('supercharger');
    require('test/src/controllers/controller');

    var expect = window.expect,
        sinon = require('sinon'),
        router,
        mediator = Backbone.mediator,
        currentRoute,
        routes = {
            'p1': 'controller#action',
            'p2': 'controller#noBeforeAction',
            'p3': 'controller#failed'
        };

    describe('Router and Subrouter', function () {

        beforeEach(function () {
            router = null;

            var Router = Backbone.Router.extend({
                routes: _.clone(routes)
            });

            router = new Router();
            router.on('route', function (path) {
                currentRoute = path;
            });

            Backbone.history.start();
        });

        afterEach(function () {
            router.navigate('/', {replace: true});
            Backbone.history.dispose();
            Backbone.history = new Backbone.History();
            Object.freeze(router);
        });


        describe('Interaction with Backbone.History', function () {

            it('should create a Backbone.History instance', function() {
                return expect(Backbone.history).to.be.an["instanceof"](Backbone.History);
            });

            it('should allow to stop the Backbone.History', function() {
                var spy;
                spy = sinon.spy(Backbone.history, 'stop');
                Backbone.history.stop();
                expect(Backbone.History.started).to.be["false"];
                expect(spy).to.have.been.calledOnce;
                return spy.restore();
            });
        });


        describe('Routing', function() {
            it('should fire a router:match event when a route matches', function() {
                var spy;
                spy = sinon.spy();
                mediator.subscribe('history:route:change', spy);
                router.navigate('p1', {trigger: true});
                expect(spy).to.have.been.calledOnce;
            });


            it('should fire a router:match event when a route matches', function() {
                var spy;
                spy = sinon.spy();
                mediator.subscribe('history:route:change', spy);
                router.navigate('p1', {trigger: true});
                expect(spy).to.have.been.calledOnce;
            });




            it('should match configuration objects', function() {
                var routed1, routed2, spy;
                spy = sinon.spy();
                mediator.subscribe('router:match', spy);

                router.match('correct-match', 'null#null');
                router.match('correct-match-with-name', 'null#null', {
                    name: 'null'
                });
                router.match('correct-match-with/:named_param', 'null#null', {
                    name: 'with-param'
                });
                routed1 = router.route({
                    controller: 'null',
                    action: 'null'
                });
                routed2 = router.route({
                    name: 'null'
                });
                expect(routed1 && routed2).to.be["true"];
                spy.should.have.been.calledTwice;
                return mediator.unsubscribe('router:match', spy);
            });

            it('should match correctly when using the root option', function() {
                var routed, spy, subdirRooter;
                subdirRooter = new Router({
                    randomOption: 'foo',
                    pushState: false,
                    root: '/subdir/'
                });
                spy = sinon.spy();
                mediator.subscribe('router:match', spy);
                subdirRooter.match('correct-match1', 'null#null');
                subdirRooter.match('correct-match2', 'null#null');
                routed = subdirRooter.route({
                    url: '/subdir/correct-match1'
                });
                expect(routed).to.be["true"];
                spy.should.have.been.calledOnce;
                mediator.unsubscribe('router:match', spy);
                return subdirRooter.dispose();
            });

            it('should match in order specified', function() {
                var routed, spy;
                spy = sinon.spy();
                mediator.subscribe('router:match', spy);
                router.match('params/:one', 'null#null');
                router.match('params/:two', 'null#null');
                routed = router.route({
                    url: '/params/1'
                });
                expect(routed).to.be["true"];
                spy.should.have.been.calledOnce;
                expect(passedParams).to.be.deep.equal({
                    one: '1'
                });
                return mediator.unsubscribe('router:match', spy);
            });

            it('should match in order specified when called by Backbone.History', function() {
                var routed, spy;
                spy = sinon.spy();
                mediator.subscribe('router:match', spy);
                router.match('params/:one', 'null#null');
                router.match('params/:two', 'null#null');
                router.startHistory();
                routed = Backbone.history.loadUrl('/params/1');
                expect(routed).to.be["true"];
                spy.should.have.been.calledOnce;
                expect(passedParams).to.be.deep.equal({
                    one: '1'
                });
                return mediator.unsubscribe('router:match', spy);
            });

            it('should identically match URLs that differ only by trailing slash', function() {
                var routed;
                router.match('url', 'null#null');
                routed = router.route({
                    url: 'url/'
                });
                expect(routed).to.be["true"];
                routed = router.route({
                    url: 'url/?'
                });
                expect(routed).to.be["true"];
                routed = router.route({
                    url: 'url/?key=val'
                });
                return expect(routed).to.be["true"];
            });

            it('should leave trailing slash accordingly to current options', function() {
                var routed;
                router.match('url', 'null#null', {
                    trailing: null
                });
                routed = router.route({
                    url: 'url/'
                });
                expect(routed).to.be["true"];
                expect(passedRoute).to.be.an('object');
                return expect(passedRoute.path).to.equal('url/');
            });

            it('should remove trailing slash accordingly to current options', function() {
                var routed;
                router.match('url', 'null#null', {
                    trailing: false
                });
                routed = router.route({
                    url: 'url/'
                });
                expect(routed).to.be["true"];
                expect(passedRoute).to.be.an('object');
                return expect(passedRoute.path).to.equal('url');
            });
            return it('should add trailing slash accordingly to current options', function() {
                var routed;
                router.match('url', 'null#null', {
                    trailing: true
                });
                routed = router.route({
                    url: 'url'
                });
                expect(routed).to.be["true"];
                expect(passedRoute).to.be.an('object');
                return expect(passedRoute.path).to.equal('url/');
            });
        });


        // it('should trigger the root function', function () {
        //     expect(currentRoute).to.be.equal('home');
        // });

        // it('should trigger end up in a sub route', function (done) {
        //     Backbone.mediator.subscribeOnce('route:resolved', function () {
        //         expect(currentRouter.subrouter.currentController.state).to.be.equal(2);
        //         done()
        //     }.bind(this));
        //
        //     currentRouter.navigate('subpage1/p1', {trigger: true});
        // });

        // it('should not trigger a beforeAction', function (done) {
        //     Backbone.mediator.subscribeOnce('route:resolved', function () {
        //         expect(currentRouter.subrouter.currentController.state).to.be.equal(1);
        //         done()
        //     });
        //
        //     currentRouter.navigate('subpage1/p2', {trigger: true});
        // });

        // it('should reject at the beforeAction', function (done) {
        //     Backbone.mediator.subscribeOnce('route:rejected', function () {
        //         done()
        //     });
        //
        //     currentRouter.navigate('subpage1/p3', {trigger: true});
        // });
    });
});


