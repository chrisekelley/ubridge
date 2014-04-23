/*global define*/

define(['backbone','marionette-original'],
  function (Backbone) {
    "use strict";
    // Checks to make sure Backbone and Marionette are on the page
    if(window.Backbone && window.Backbone.Marionette && window.Backbone.Marionette.Application) {

      Backbone.Marionette.Application.prototype.navigate = function (route, options) {
        options || (options = {});
        Backbone.history.navigate(route, options);
      }

      Backbone.Marionette.Application.prototype.getCurrentRoute = function () {
        return Backbone.history.fragment
      }

      return Backbone.Marionette.Application;


//      return Backbone.Marionette.Application.extend({
//
//        navigate: function (route, options) {
//          options || (options = {});
//          Backbone.history.navigate(route, options);
//        },
//        getCurrentRoute: function () {
//          return Backbone.history.fragment
//        }
//      });
    }

  });
