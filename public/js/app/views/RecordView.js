/*global define*/

define(['backbone', 'marionette','views/RecordElementView','views/FormElementView', 'collections/FormElements',
  'hbs!templates/displayTableWidget', 'form2object', 'toObject', 'FORMY','collections/ActionTakenRecordList', 'hbs!templates/hiddenWidget',
  'models/ActionTaken', 'models/Record', 'App', 'coconutUtils'],
  function (Backbone, Marionette, RecordElementView, FormElementView, FormElements, displayTableWidget, form2object,
            toObject, FORMY, ActionTakenRecordList, hiddenWidget, ActionTaken, Record, App, coconutUtils) {
  "use strict";

  /**
   * render the hidden formElements, attaching them to this.currentParentName.
   * appendHtml skips the rendering of special cases such as hidden fields when viewing records.
   * All new rows attach to currentTableName, the formElements attach to the currentParentName.
   * render each formElement and increment the CollumnsInRowCount
   * use the colSpan value to increment the CollumnsInRowCount.
   * Also, if the closeRow === true, increment CollumnsInRowCount to the table's cols value. This will force a new row for the next formElement.
   * after rendering a cell, if the CollumnsInRowCount GTE the table's cols value, start a new row.
   */
  return Backbone.Marionette.CompositeView.extend({
//    template : template,
    itemView : RecordElementView,
    itemViewContainer : '#formElements',
    itemViewContainerA: null, // Cache container #a
    itemViewContainerB: null, // Cache container #b

    events : {
      "click #form-save" : "saveRecord"
    },
    getItemView: function(item) {
      if (typeof this.model.get("renderFormElement") !== "undefined") {
        return FormElementView;
      } else {
        return RecordElementView;
      }
    },
    initialize : function() {
      //this.listenTo(this.collection, 'all', this.update);
      this.listenTo(this.model, 'change', this.render, this);

      //console.log("this.model in RecordView: "+ JSON.stringify(this.model.toJSON()));
      //this.form = this.options.currentForm;
      this.form = this.model.get("form");
      this.patientId = this.form.patientId;
      this.label =  this.form.get("label");
      //console.log("form: " + JSON.stringify(this.form));
      var flowId = null;
      var formId = this.form.get("_id");
      //var created = this.model.created;
      this.currentRecord = this.model.get("currentRecord");
      this.parentRecord = this.model.get("parentRecord");
      this.parentId = this.model.get("parentId");
      this.formElements = new FormElements(this.form.get("form_elements"), { view: this });
      var parentIdWidget = {"label": "parentIdWidget","value":this.parentId,"identifier": "parentId","inputType": "hidden"};
      var flowIdWidget = {"label": "flowIdWidget","value": flowId,"identifier": "flowId","inputType": "hidden"};
      var formIdWidget = {"label": "formIdWidget","value": formId,"identifier": "formId","inputType": "hidden"};
      this.formElements.add(parentIdWidget,{at: 0});
      this.formElements.add(flowIdWidget,{at: 1});
      this.formElements.add(formIdWidget,{at: 2});

//      this.formElements.add(idWidget,{at: 3});
//      this.formElements.add(revWidget,{at: 4});
      if ((typeof this.currentRecord !== 'undefined' && this.currentRecord !== null)) {
        var assignedId = this.model.get("assignedId");
        var created = this.model.get("createdWidget");
        var type = this.model.get("type");
        var typeWidget = {"label": "typeWidget","value": type,"identifier": "type","inputType": "hidden"};
        var assignedIdWidget = {"label": "assignedIdWidget","value": assignedId,"identifier": "assignedId","inputType": "hidden"};
        var createdWidget = {"label": "createdWidget","value": created,"identifier": "created","inputType": "hidden"};
        this.formElements.add(typeWidget,{at: 3});
        this.formElements.add(assignedIdWidget,{at: 4});
        this.formElements.add(createdWidget,{at: 5});
        var _id = this.currentRecord.get("_id");
        if (_id != null) {
          var idWidget = {"label": "idWidget","value":_id,"identifier": "_id","inputType": "hidden"};
          this.formElements.add(idWidget,{at: 6});
        }
        var _rev = this.currentRecord.get("_rev");
        if (_rev != null) {
          var revWidget = {"label": "revWidget","value":_rev,"identifier": "_rev","inputType": "hidden"};
          this.formElements.add(revWidget,{at: 7});
        }
      }
      this.formElementNames = [];
      this.formElementOrder = 0;
      //this.formElements.each(this.populateFormElementNames, this.incrementFormElementOrder);
      this.collection = this.formElements;
    },
    currentParentName: "formElements",
//    currentParent: $(this.currentParentName),
    currentParent: $("formElements"),
    currentTableName: "",
    CollumnsInRowCount:0,
    formElements: null,
    parentRecord:null,
    form: null,
    actionTakens: null,
    label: "",
    recordId: "",
    startNewRow:false,
    formElementOrder:0,
    currentRecord: null,

    onBeforeRender: function(){
      //console.log("this.model in RecordView: "+ JSON.stringify(this.model.toJSON()));
    },
//    getItemView: function(item) {
//      if (item.get("inputType") == 'display-tbl-begin') {
//        return TableElementView;
//      } else {
//        return RecordElementView;
//      }
//    },
    // The default implementation:
    appendHtml: function(collectionView, itemView, index){
      if (typeof itemView.model === 'undefined') {
//        console.log("model is null.")
      }
      if (itemView.model.get("identifier") == 'endTableIdentifier') {
//        console.log("identifier is endTableIdentifier.")
      }
      var $container = this.getItemViewContainer(collectionView);
      //$container.append(iv.el);
      var formElement = itemView.model;
      var inputType = formElement.get("inputType");
      var identifier = formElement.get("identifier");
      var html = "";
      var formElementTemplate = "";
      this.formElementOrder++;
      this.formElementNames.push(identifier);
//      console.log("appendHtml: formElement identifier: " + identifier + " inputType:" + inputType + "this.currentParentName: "
//        + this.currentParentName + " this.formElementOrder:" + this.formElementOrder);
      if (collectionView.isBuffering) {
        // buffering happens on reset events and initial renders in order to reduce the number of inserts into the
        // document, which are expensive.
        $container.elBuffer.appendChild(itemView.el);
      }
      else {
        // If we've already rendered the main collection, just append the new items directly into the element.
        if (inputType == 'display-tbl-begin') {
          formElementTemplate = displayTableWidget;
          html = formElementTemplate(formElement.toJSON());
          $container.append(html)
          //var selector = _.result(collectionView, this.currentTableName);
          //          containerView.$(selector);
          if (this.$itemViewContainer){
            delete this.$itemViewContainer;
          }
          //this.itemViewContainer = this.currentParentName;
          this.currentTableName = "#tblbeginTableIdentifier";
          this.currentTableName = "#tbl" + identifier;
          this.itemViewContainer = this.currentTableName;
          this.itemViewContainerA = this.currentTableName;
          //this.currentParent = $container
          //collectionView.$itemViewContainer = $(this.currentTableName);
        } else if (inputType == 'alertCheckbox') {
          var value = this.model.get(identifier)
            if (typeof this.model.get("renderFormElement") !== "undefined") {
              this.$(this.currentParentName).append(itemView.el);
            } else {
              //if (itemView.html == "") {
              if (typeof value === 'undefined') {
                } else {
                this.$(this.currentParentName).append(itemView.el);
              }
            }
        } else if (inputType == 'hidden') {
          if (typeof this.model.get("renderFormElement") === "undefined") {
//          skip
          } else {
            formElementTemplate = hiddenWidget;
            html = formElementTemplate(formElement.toJSON());
            $container.append(html)
//            if (this.$itemViewContainer){
//              delete this.$itemViewContainer;
//            }
//            //this.itemViewContainer = this.currentParentName;
//            this.currentTableName = "#tblbeginTableIdentifier";
//            this.currentTableName = "#tbl" + identifier;
//            this.itemViewContainer = this.currentTableName;
          }

        } else if (inputType == 'button' && typeof this.model.get("renderFormElement") === "undefined") {
//          skip
        } else if (inputType == 'display-tbl-end') {
//          skip
        } else {
          //$container.append(itemView.el);
          this.$(this.currentParentName).append(itemView.el);
        }
      }

    },

    // Called after all children have been appended into the elBuffer
    appendBuffer: function(collectionView, buffer) {
      collectionView.$el.append(buffer);
    },

    // called on initialize and after appendBuffer is called
    initRenderBuffer: function() {
      this.elBuffer = document.createDocumentFragment();
    },
    onBeforeItemAdded: function(itemView){
      var formElement = itemView.model;
      itemView.colspan = formElement.get("colspan");
      if (itemView.colspan == null) {
        itemView.colspan = 1;
      }
      $(itemView.el).attr('colspan',itemView.colspan);
      var currentId = $(itemView.el).attr('id');
      var inputType = formElement.get("inputType");
      var datatype = formElement.get("datatype");
      var closeRow = formElement.get("closeRow");
      var identifier = formElement.get("identifier");
      if (inputType == 'display-actionTakenLink') {
        formElement.set({"value": this.model.get("_id")});
      }
      var size = formElement.get("size");
      var colspan = 1;

      if ((formElement.get("colspan") !== "") || typeof formElement.get("colspan") === 'undefined') {
        colspan = parseInt(formElement.get("colspan"), 10);
      }
      // don't count the hidden widgets at the beginning of the form.
      if ((inputType !== "hidden") && (datatype !== "display")) {
        this.CollumnsInRowCount = this.CollumnsInRowCount + colspan;
      }
      if ((inputType === "display-header")) {
        this.CollumnsInRowCount = this.CollumnsInRowCount + colspan;
      }
      formElement.set({"colspan":this.CollumnsInRowCount});

      if (typeof this.currentRecord !== 'undefined') {
        var value = this.currentRecord.get(identifier)
        if (value != null) {
          console.log("value for " + identifier + ": " + value);
          formElement.set({"value": value});
        }
      }
//      console.log("onBeforeItemAdded: formElement identifier: " + identifier + " inputType:" + inputType + " CollumnsInRowCount: " + this.CollumnsInRowCount);
    },
    onAfterItemAdded: function(itemView){
      var formElement = itemView.model;
      var inputType = formElement.get("inputType");
      var closeRow = formElement.get("closeRow");
      var identifier = formElement.get("identifier");
      var nextFormElement = null;
      var nextFormElementIdentifier = null;
      var nextFormElementInputType = null;
      var nextFormElementValue = null;
      if (this.formElementOrder >1) {
        nextFormElement = this.formElements.models[this.formElementOrder];
        if (typeof nextFormElement !== "undefined") {
          nextFormElementIdentifier = nextFormElement.get("identifier");
          nextFormElementInputType = nextFormElement.get("inputType")
          //nextFormElementValue = nextFormElement.model.get(identifier)
//          console.log("current: " + identifier + " next: " +nextFormElementIdentifier + " nextFormElementValue: " + nextFormElementValue);
        }
      }

      if (closeRow === "false") {
        if (this.CollumnsInRowCount % 2) {
          closeRow = "false";
        } else {
          closeRow = "true";
//          console.log("Setting closeRow to true for " + identifier + " ; CollumnsInRowCount: " + this.CollumnsInRowCount);
        }
      }
      //console.log("add one:" + JSON.stringify(formElement));
      if (closeRow == "true") {
        //console.log("closeRow1: this.currentParentName: " + this.currentParentName);
        //$("table").append("<tr id=\"row" + identifier + "\"></tr>");
        if (nextFormElementInputType !== null) {
          if (nextFormElementInputType == 'display-header') {
            this.$(this.currentTableName).append("<tr id=\"row_" + nextFormElementIdentifier + "\" class=\"sectionHeaderRow\"></tr>");
          } else if (nextFormElementInputType == 'alertCheckbox') {
//            if (typeof(value) == "undefined") {
//            } else {
              this.$(this.currentTableName).append("<tr id=\"row_" + nextFormElementIdentifier + "\"></tr>");
            //}
          } else if (nextFormElementInputType == 'button' ) {
              this.$(this.currentTableName).append("<tr id=\"row_" + nextFormElementIdentifier + "\"></tr>");
          } else if (nextFormElementInputType == 'display-tbl-end') {
//          skip
          } else {
            this.$(this.currentTableName).append("<tr id=\"row_" + nextFormElementIdentifier + "\"></tr>");
          }
        }
        //var $container = this.getItemViewContainer(this);
        //$container.append("<tr id=\"row" + identifier + "\"></tr>");
        this.currentParentName = "#row_" + nextFormElementIdentifier;
        this.currentParent = $(this.currentParentName);
        this.CollumnsInRowCount = 0;	//reset CollumnsInRowCount.
//        console.log("closeRow2: this.currentParentName: " + this.currentParentName);
      }

//      console.log("onAfterItemAdded: formElement identifier: " + identifier + " nextFormElementIdentifier: " + nextFormElementIdentifier + " nextFormElementInputType:" + nextFormElementInputType + " CollumnsInRowCount: " + this.CollumnsInRowCount);
    },
    addActionTaken: function(record) {
      if ((record.attributes.type != null) && (record.attributes.type === "actionTaken")) {
        var view = new ActionTakenListItemView({model: record});
        //this.rendered = this.view.render().el;
//        console.log("add one in RecordView:" + JSON.stringify(record));
        this.$("#actionTakenList").append(view.render().el);
      } else {
//        console.log("Skipping this record - not an actionTaken.")
      }
    },
    saveRecord: function(e){
      e.preventDefault();
      console.log("validating the form submission.");
      var validationErrors = [];
      this.formElements.each(function(formElement){
        var datatype = formElement.get("datatype");
        if (datatype != "display") {
          var inputValue = $("#" + formElement.get("identifier")).val();
          //console.log("validate:" + formElement.get("label") + " field value:" + formElement.get("value") + " inputValue:" + inputValue);
          validationErrors.push(formElement.validate({value:inputValue}));
        }
      });
      var errors = _.compact(validationErrors);
      if (errors.length == 0) {
        console.log("Ready to save");
        var formData = $("#theForm").toObject();
        var formId = $("#formId").val();
        console.log("formData: " + JSON.stringify(formData));
        var _id = formData._id;
        if (_id == null) {
          var unixTimestamp = Math.round(+new Date()/1000);
          formData.created =  unixTimestamp;
          //formData.created = new Date();
          //console.log("formData.created: " + formData.created);
          formData.lastModified =  formData.created;
          if (formId === "incident") {
            if (this.model.get("records") === null) {
              this.model.set("records", new ActionTakenRecordList)
            }
//				  var info = $.couch.db(Backbone.couch_connector.config.db_name).info(
//						  {
//							  success : function(resp){
//								  console.log("info: " + JSON.stringify(resp));
//								  var doc_count = resp["doc_count"];
//								  var doc_del_count = resp["doc_del_count"];
//								  var assignedId = doc_count + doc_del_count;
//								  console.log("assignedId: " + assignedId);
//								  formData.assignedId = assignedId.toString();
//								  console.log("FORMY.Incidents.create(formData);" + JSON.stringify(formData));


//								  FORMY.Incidents.create(formData,{
//									  success: function(model, resp){
//										  nextModel = model;
//										  //console.log("saveDoc nextModel.");
//										  FORMY.sessionRecord = model;
//										  inspectModelAndGo(model);
//									  },
//									  error: function() {
//										  console.log("Error saving: " + arguments);
//									  }
//								  });


//							  }
//						  }
//				  );

            //formData._id = "incident/" +coconutUtils.uuidGenerator();
            //var incident = new Incident(formData);
            var record = new Record(formData);
            record.type="incident";
            record.save();
            //this.inspectModelAndGo(incident);
            App.appRouter.navigate('home', true);
          } else if (formId === "actionTaken") {
            if (this.model.get("records") === null) {
              this.model.set("records", new IncidentRecordList)
            }

            var actionTaken = new ActionTaken(formData);
            actionTaken.type="actionTaken";
            actionTaken.save();
            // open the parent incident record
            var record = new Record(this.parentRecord.attributes);
            if (typeof actionTaken.get("resolved") != 'undefined') {
              if (typeof window.sms != 'undefined') {
                var number = record.get("phone")
                var message = actionTaken.get("comment");
                var intent = "INTENT"; //leave empty for sending sms using default intent, "INTENT" to copy to SMS app.
                var success = function () { console.log("SMS Message sent successfully") };
                var error = function (e) { alert('Message Failed:' + e);console.log("Error sending message: " + e); };
                sms.send(number, message, intent, success, error);
              }
              record.set({dateResolved:unixTimestamp});
            }
            record.set({lastModified:unixTimestamp});
            record.save();
            console.log("Updating the record using backbone save");

            //this.inspectModelAndGo(actionTaken);
            App.appRouter.navigate('home', true);
          } else {
            console.log("Saving the record using FORMY.sessionRecord.records.create");
            FORMY.sessionRecord.records.create(formData,{
              success: function(model, resp){
                console.log("added new record to FORMY.sessionRecord.records.");
                //this.inspectModelAndGo(model);
                App.appRouter.navigate('home', true);
              },
              error: function() {
                console.log("Error saving: " + arguments);
              }
            });
            //model.clear;
          }
        } else {
          var unixTimestamp = Math.round(+new Date()/1000);
          formData.lastModified = unixTimestamp;
          console.log("Updating the record using record.save");
          var record = new Record(formData);
          if (formId === "actionTaken") {
            if (typeof record.get("resolved") != 'undefined') {
              // open the parent incident record
              var incident = new Record(this.parentRecord.attributes);
              incident.set({dateResolved:unixTimestamp});
              incident.save();
            }
          }
//			  if (formData.assignedId != null) {
//				  var assignedId = parseInt(formData.assignedId);
//				  console.log("formData.assignedId: " + formData.assignedId + " assignedId: " + assignedId);
//				  record.assignedId = assignedId;
//			  }
//          record.save();
//          this.inspectModelAndGo(record);
          record.save({},{
            success: function(model, resp){
              console.log("Updated the record.");
              //this.inspectModelAndGo(model);
              if (formId === "actionTaken") {
                var parentId = model.get("parentId");
                App.appRouter.navigate('record/'+ parentId, true);
              } else {
                App.appRouter.navigate('home', true);
              }
            },
            error: function() {
              console.log("Error saving: " + JSON.stringify(arguments));
            }
          });
          //model.clear;
        }


        //this.options.currentForm = null;
        this.form = null;

        //$("#formRenderingView").remove();

      } else {
        console.log("Errors:" + JSON.stringify(errors));
        alert(errors);
      }	  //}
    },
     inspectModelAndGo: function(newRecord){
      var queryId = null;
      var formId = null;
      var identifier = null;
      var parentId = null;
      if ((typeof newRecord.get !== "undefined") && (typeof newRecord.get("formId") !== "undefined")) {
        formId =  newRecord.get("formId");
      } else {
        formId =  newRecord.formId;
      }
      if ((typeof newRecord.get !== "undefined") && (typeof newRecord.get("_id") !== "undefined")) {
        identifier =  newRecord.get("_id");
      } else {
        identifier =  newRecord._id;
      }
      if ((typeof newRecord.get !== "undefined") && (typeof newRecord.get("parentId") !== "undefined")) {
        parentId =  newRecord.get("parentId");
      } else {
        parentId =  newRecord.parentId;
      }

      if (formId === "incident") {
        queryId =  identifier;
        //console.log("identifier is queryId: " + queryId + " for formId: " + formId);
      } else {
        queryId = parentId;
        //console.log("parentId is queryId: " + queryId + " for formId: " + formId);
      }
      //FORMY.router.navigate('patientRecords/' + queryId, true);
       App.appRouter.navigate('home', true);
    }

  });
});

//var ActionTakenListItemView = Backbone.View.extend({
//  tagName : "tr",
//  template: Handlebars.compile($("#actionTakenList-template").html()),
//
//  initialize : function(){
//    //this.model.bind('change', this.render, this);
//    // from backbone-couch.js chat example:
////		 _.bindAll(this, 'render');
////		this.model.bind('change', this.render);
//    this.listenTo(this.model, 'change', this.render);
//    this.listenTo(this.model, 'destroy', this.remove);
//  },
//
//  render : function(){
//    this.content = this.model.toJSON();
//    this.html = this.template(this.content);
//    $(this.el).html(this.html);
//    //console.log("render SearchListItemView: "+ JSON.stringify(this.html));
//    return this;
//  }
//});



