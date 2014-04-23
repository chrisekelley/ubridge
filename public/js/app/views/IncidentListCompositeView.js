/*global define*/

define(['backbone', 'marionette','views/IncidentItemView','hbs!templates/welcome', 'App'], function (Backbone, Marionette,ItemView, template, App) {
  "use strict";

  return Backbone.Marionette.CompositeView.extend({
    template : template,
    itemView : ItemView,
    itemViewContainer : '#incidents',
    endkey: null,
    searchTerm: null,
    department: null,
    events : {
      "click #nextLink"	  : "nextLink"
    },
    initialize : function() {
      this.listenTo(this.collection, 'all', this.update);
    },
//    update: function() {
//      console.log("update.");
//      if (this.collection.length === 0) {
//        this.$el.parent().hide();
//      } else {
//        this.$el.parent().show();
//      }
//    },
    nextLink: function() {
      var departmentId = this.model.get("department");
      var endkey = this.model.get("endkey");
      var searchTerm = this.model.get("searchTerm");
      console.log("endkey: " + this.model.get("endkey"));
      if (endkey != null) {
        if (departmentId != null) {
          console.log("Searching department: " + departmentId);
          var searchTerm = " ";
          App.appRouter.navigate('search/' + searchTerm + "/" + departmentId + "/" + endkey, true);
        } else if (typeof searchTerm !== 'undefined' && searchTerm != null && searchTerm != " ") {
            var departmentId = " ";
            App.appRouter.navigate('search/' + searchTerm + "/" + departmentId + "/" + endkey, true);
          } else {
            App.appRouter.navigate('home/' + endkey, true);
          }
      } else {
        console.log("problem with nextLink");
      }

    }
  });
});

