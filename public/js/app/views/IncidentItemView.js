/*global define*/

define(['backbone', 'marionette', 'handlebars', 'hbs!templates/incidentItemView'], function (Backbone, Marionette,Handlebars,template) {
  "use strict";

  return Backbone.Marionette.CompositeView.extend({
    tagName : 'tr',
    //template : Handlebars.compile($("#search-template").html()),
    template: template,

    events : {
      'click .destroy' : 'destroy',
      'dblclick label' : 'onEditClick',
      'keypress .edit' : 'onEditKeypress',
      'click .toggle'  : 'toggle'
    },

    initialize : function() {
      //this.bindTo(this.model, 'change', this.render, this);
      this.listenTo(this.model, 'change', this.render);
    },

    destroy : function() {
      this.model.destroy();
    }
  });
});