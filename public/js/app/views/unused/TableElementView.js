/*global define*/

define(['backbone', 'marionette', 'handlebars', 'hbs!templates/recordValueRender'], function (Backbone, Marionette,Handlebars,template) {
  "use strict";

  return Backbone.Marionette.CompositeView.extend({
    tagName: "table",
    //template: Handlebars.compile($("#record-element-template").html()),
    template: template,
//    onBeforeRender: function(){
//      if (this.model.get("inputType") == 'display-tbl-begin') {
//        this.tagName = "table";
//      }
//    },
//    onBeforeRender: function(){
//
//
////      from RecordView addOne
//
//
//      // don't count the hidden widgets at the beginning of the form.
//      if ((inputType !== "hidden") && (datatype !== "display")) {
//        this.currentRow ++;
//      }
//      //console.log("currentRow: " + this.currentRow + " identifier: " + identifier);
//      if (this.value != null) {
//        console.log("value for " + identifier + ": " + this.value);
//        formElement.set({"value": this.value});
//      }
//      if (this.orientation === "vert") {
//        tblCols = 2;
//        if (closeRow === "false") {
//          if (this.currentRow % 2) {
//            closeRow = "false";
//          } else {
//            closeRow = "true";
//            //console.log("Setting closeRow to true for " + identifier + " ; currentRow: " + this.currentRow);
//          }
//        }
//        if (inputType == 'button') {
//          closeRow = "true";
////				formElement.set({"width":"450"});
////				formElement.set({"colspan":"2"});
//        } else if (inputType == 'text') {
//          if (size > 25) {
//            //console.log("Size: " + size);
//            closeRow = "true";
//            formElement.set({"colspan":"2"});
//            if (size >= 50) {
//              formElement.set({"size":"50"});
//            }
//          }
//        } else if (inputType == 'textarea') {
//          closeRow = "true";
//          formElement.set({"colspan":"2"});
//          formElement.set({"rows":"4"});
//          formElement.set({"cols":"60"});
//        } else {
//          formElement.set({"colspan":colspan});
//        }
//      }
//      if (tblCols == null) {
//        if (this.orientation === "vert") {
//          tblCols = 2;
//        } else {
//          tblCols = 3;
//        }
//      }
//      var currentTableName = "#tblbeginTableIdentifier";
//      //console.log("add one:" + JSON.stringify(formElement));
//      if (inputType == 'display-tbl-begin') {
//        template = displayTableWidgetCompiledHtml;
//        html = template(formElement.toJSON());
//        //$(this.$("#formElements")).append(html);
//        $("#formElements").append(html);
//        currentParentName = "#beginTableRow" + identifier;
//        currentParent = $(currentParentName);
//      } else if (inputType == 'display-tbl-end') {
//      } else if (inputType == 'hidden-empty') {
//        html = "<!-- " + identifier + " -->";
//        $(this.$("#formElements")).append(html);
//      } else if (inputType == 'hidden-preset') {
//        html = "<!-- " + identifier + " -->";
//        $(this.$("#formElements")).append(html);
//      } else if (inputType == 'display-header') {
//        formElement.set({"tblCols" : tblCols});
//        currentParent.append((new RecordElementView({model: formElement})).render().el);
//      } else if (inputType == 'hidden') {
//        currentParentName = "#theForm";
//        currentParent = $(currentParentName);
//        closeRow = "false";
//        $(this.$("#formElements")).append((new RecordElementView({model: formElement})).render().el);
//        //console.log("Hidden Element: " + identifier + " currentParentName: " + currentParentName);
//      } else if (inputType == 'alertCheckbox') {
//        if (typeof this.value !== 'undefined') {
//          currentParent.append((new RecordElementView({model: formElement})).render().el);
//        }
//      } else {
//        currentParent.append((new RecordElementView({model: formElement})).render().el);
//      }
//      if (closeRow == "true") {
//        //$("table").append("<tr id=\"row" + identifier + "\"></tr>");
//        $(currentTableName).append("<tr id=\"row" + identifier + "\"></tr>");
//        currentParentName = "#row" + identifier;
//        currentParent = $(currentParentName);
//        this.currentRow = 0;	//reset currentRow.
//        //console.log("CloseRow currentParentName: " + currentParentName);
//      }
//    },



//    initialize: function (){
//      //this.model.bind('destroy', this.remove, this);
//      //this.model.bind('change', this.render, this);
//      this.model.bind('validationError', this.showErrorMessages, this);
//      this.model.view = this;
//
//      this.colspan = this.model.get("colspan");
//      if (this.colspan == null) {
//        this.colspan = 1;
//      }
//      $(this.el).attr('colspan',this.colspan);
//      var currentId = $(this.el).attr('id');
//
////      from RecordView addOne
//
//      var inputType = formElement.get("inputType");
//      var datatype = formElement.get("datatype");
//      var closeRow = formElement.get("closeRow");
//      var identifier = formElement.get("identifier");
//      var tblCols = formElement.get("cols");
//      var size = formElement.get("size");
//      var colspan = formElement.get("colspan");
//      this.value = this.model.get(identifier);
//      if (inputType == 'display-actionTakenLink') {
//        formElement.set({"value": this.model.get("_id")});
//      }
//      // don't count the hidden widgets at the beginning of the form.
//      if ((inputType !== "hidden") && (datatype !== "display")) {
//        this.currentRow ++;
//      }
//      //console.log("currentRow: " + this.currentRow + " identifier: " + identifier);
//      if (this.value != null) {
//        console.log("value for " + identifier + ": " + this.value);
//        formElement.set({"value": this.value});
//      }
//      if (this.orientation === "vert") {
//        tblCols = 2;
//        if (closeRow === "false") {
//          if (this.currentRow % 2) {
//            closeRow = "false";
//          } else {
//            closeRow = "true";
//            //console.log("Setting closeRow to true for " + identifier + " ; currentRow: " + this.currentRow);
//          }
//        }
//        if (inputType == 'button') {
//          closeRow = "true";
////				formElement.set({"width":"450"});
////				formElement.set({"colspan":"2"});
//        } else if (inputType == 'text') {
//          if (size > 25) {
//            //console.log("Size: " + size);
//            closeRow = "true";
//            formElement.set({"colspan":"2"});
//            if (size >= 50) {
//              formElement.set({"size":"50"});
//            }
//          }
//        } else if (inputType == 'textarea') {
//          closeRow = "true";
//          formElement.set({"colspan":"2"});
//          formElement.set({"rows":"4"});
//          formElement.set({"cols":"60"});
//        } else {
//          formElement.set({"colspan":colspan});
//        }
//      }
//      if (tblCols == null) {
//        if (this.orientation === "vert") {
//          tblCols = 2;
//        } else {
//          tblCols = 3;
//        }
//      }
//      var currentTableName = "#tblbeginTableIdentifier";
//      //console.log("add one:" + JSON.stringify(formElement));
//      if (inputType == 'display-tbl-begin') {
//        template = displayTableWidgetCompiledHtml;
//        html = template(formElement.toJSON());
//        //$(this.$("#formElements")).append(html);
//        $("#formElements").append(html);
//        currentParentName = "#beginTableRow" + identifier;
//        currentParent = $(currentParentName);
//      } else if (inputType == 'display-tbl-end') {
//      } else if (inputType == 'hidden-empty') {
//        html = "<!-- " + identifier + " -->";
//        $(this.$("#formElements")).append(html);
//      } else if (inputType == 'hidden-preset') {
//        html = "<!-- " + identifier + " -->";
//        $(this.$("#formElements")).append(html);
//      } else if (inputType == 'display-header') {
//        formElement.set({"tblCols" : tblCols});
//        currentParent.append((new RecordElementView({model: formElement})).render().el);
//      } else if (inputType == 'hidden') {
//        currentParentName = "#theForm";
//        currentParent = $(currentParentName);
//        closeRow = "false";
//        $(this.$("#formElements")).append((new RecordElementView({model: formElement})).render().el);
//        //console.log("Hidden Element: " + identifier + " currentParentName: " + currentParentName);
//      } else if (inputType == 'alertCheckbox') {
//        if (typeof this.value !== 'undefined') {
//          currentParent.append((new RecordElementView({model: formElement})).render().el);
//        }
//      } else {
//        currentParent.append((new RecordElementView({model: formElement})).render().el);
//      }
//      if (closeRow == "true") {
//        //$("table").append("<tr id=\"row" + identifier + "\"></tr>");
//        $(currentTableName).append("<tr id=\"row" + identifier + "\"></tr>");
//        currentParentName = "#row" + identifier;
//        currentParent = $(currentParentName);
//        this.currentRow = 0;	//reset currentRow.
//        //console.log("CloseRow currentParentName: " + currentParentName);
//      }
//    },
    currentParentName: "formElements",
    //currentParent: $(currentParentName),
    currentParent: "",
    currentTableName: "",
    currentRow:0
//    render: function(){
//      this.colspan = this.model.get("colspan");
//      if (this.colspan == null) {
//        this.colspan = 1;
//      }
//      $(this.el).attr('colspan',this.colspan);
//      var currentId = $(this.el).attr('id');
//      //console.log("currentId: " + currentId);
//      var renderedHtml = this.template(this.model.toJSON());
//      $(this.el).html(renderedHtml);
//      //console.log("currentId: "  + currentId + " renderedHtml: " + renderedHtml);
//      return this;
//    }
  });
});
