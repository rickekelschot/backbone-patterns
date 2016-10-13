// define(function (require) {
//
//     require('supercharger');
//
//     return Backbone.Controller.extend({
//
//         state: 0,
//
//         beforeAction: function (params) {
//             return new Promise(function (resolve, reject) {
//                 this.state += 1;
//                 resolve();
//             }.bind(this));
//         },
//
//         action: function () {
//             this.state += 1;
//         },
//
//         noBeforeAction: function (params) {
//             this.state += 1;
//         },
//
//         beforeFailed: function () {
//             this.state += 1;
//             return window.Promise.reject();
//         },
//
//         failed: function () {
//             this.state += 1;
//         }
//
//     });
// });