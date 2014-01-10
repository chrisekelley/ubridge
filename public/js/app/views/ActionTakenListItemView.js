/*global define*/

define(['backbone', 'marionette', 'hbs!templates/actionTakenListItem'], function (Backbone, Marionette,template) {
  "use strict";

  return Backbone.Marionette.ItemView.extend({

      tagName : "tr",
//      template: Handlebars.compile($("#actionTakenList-template").html())
      template: template
//
//      initialize : function(){
//        //this.model.bind('change', this.render, this);
//        // from backbone-couch.js chat example:
////		 _.bindAll(this, 'render');
////		this.model.bind('change', this.render);
//        this.listenTo(this.model, 'change', this.render);
//        this.listenTo(this.model, 'destroy', this.remove);
//      },
//
//      render : function(){
//        this.content = this.model.toJSON();
//        this.html = this.template(this.content);
//        $(this.el).html(this.html);
//        //console.log("render SearchListItemView: "+ JSON.stringify(this.html));
//        return this;
//      }
  });

});
