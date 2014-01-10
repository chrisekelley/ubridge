/*global define*/

define(['backbone', 'marionette', 'hbs!templates/desktopHeader','App'], function (Backbone, Marionette,template, App) {
  "use strict";

  return Backbone.Marionette.ItemView.extend({
    template : template,
    events: {
      "click #form-client " : "incidentLink",
      "click #form-search " : "search",
      "change #department"  : "search"
    },
    incidentLink: function() {
      App.appRouter.navigate('incidentForm', true);
    },
    search: function(e) {
      e.preventDefault();
      var searchTerm =  $('#search_string').val();
      var department =  $('#department').val();
      if (searchTerm == "" && department == "") {
        console.log("No search terms; Back to home");
        App.appRouter.navigate('home', true);
      } else if (searchTerm == "" && department != "") {
        console.log("Searching department");
        searchTerm = " ";
        App.appRouter.navigate('search/' + searchTerm + "/" + department, true);
      } else {
        console.log("Searching keyword");
        App.appRouter.navigate('search/' + searchTerm, true);
      }
    }

  });

});
