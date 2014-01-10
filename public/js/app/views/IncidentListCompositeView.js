/*global define*/

define(['backbone', 'marionette','views/IncidentItemView','hbs!templates/welcome'], function (Backbone, Marionette,ItemView, template) {
  "use strict";

  return Backbone.Marionette.CompositeView.extend({
    template : template,
    itemView : ItemView,
    itemViewContainer : '#incidents',

    events : {
    },

    initialize : function() {
      this.listenTo(this.collection, 'all', this.update);
    },
    update: function() {
      console.log("update.");
      if (this.collection.length === 0) {
        this.$el.parent().hide();
      } else {
        this.$el.parent().show();
      }
    }
  });
});

