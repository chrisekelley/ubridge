/*global define*/

define(['backbone', 'marionette', 'handlebars', 'hbs!templates/formElementRender'], function (Backbone, Marionette,Handlebars,template) {
  "use strict";

  return Backbone.Marionette.CompositeView.extend({
    tagName: "td",
    //template: Handlebars.compile($("#record-element-template").html()),
    template: template,
    onBeforeRender: function(){
      if (this.model.get("inputType") == 'display-tbl-begin') {
        this.tagName = "table";
      }
      $(this.el).attr('id','cell_' + this.model.get("identifier"));
    },
    currentParentName: "formElements",
    //currentParent: $(currentParentName),
    currentParent: "",
    currentTableName: "",
    currentRow:0
  });
});
