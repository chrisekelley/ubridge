define(['App', 'backbone', 'marionette', 'views/DesktopHeaderView','collections/IncidentList','views/IncidentListCompositeView',
  'FORMY', 'models/Incident', 'models/ActionTaken', 'views/RecordView','views/FormElementView', 'hbs!templates/incidentRecord',
  'hbs!templates/actionTaken','QUERIES', 'views/ActionTakenCompositeView', 'hbs!templates/actionTakenList', 'layouts/RecordActionTakenLayout',
  'models/Record', 'coconutUtils'
],
    function (App, Backbone, Marionette, Header, IncidentList, IncidentListCompositeView, FORMY, Incident, ActionTaken, RecordView,
              FormElementView, incidentRecordTemplate, actionTakenTemplate, QUERIES, ActionTakenCompositeView, actionTakenListTemplate,
              RecordActionTakenLayout, Record, coconutUtils) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            //App.headerRegion.show(new DesktopHeaderView());
        },
        //gets mapped to in AppRouter's appRoutes
      index:function (endkey) {
        //App.mainRegion.show(new WelcomeView());
        var incidentList = new IncidentList();
        var viewOptions = {
          collection : incidentList
        };
        //incidentList.fetch();

        App.headerRegion.show(new Header());
        App.mainRegion.show(new IncidentListCompositeView(viewOptions));

        var limit = 15;
        if (endkey === null || endkey === "" || endkey == "home") {
          endkey = 0;
        }
        var opts = {
          query: {
            fun: {
              map: function(doc) {
                if (doc.formId === "incident") {
                  emit(doc.lastModified, doc);
                }
              }
            },
            descending:true,
            endkey:parseInt(endkey, 10),
            limit:limit
          }
        };
        incidentList.fetch({fetch: 'query',
          options: opts,
          success: function(collection, response, options) {
            console.log("item count: " + collection.length);
            //console.log("collection: " + JSON.stringify(collection));
            FORMY.Incidents = incidentList;
            var listLength = incidentList.length;
            if (listLength < limit) {
              limit = listLength;
              endkey = null;
            } else {
              var next_start_record = incidentList.at(limit-1);
              if (next_start_record) {
                endkey_docid = next_start_record.id;
                console.log("next_start_record: " + JSON.stringify(next_start_record));
                //console.log("startkey_docid: " + endkey_docid);
                endkey = next_start_record.get("lastModified");
                FORMY.Incidents = incidentList.remove(next_start_record);
              }
            }
            if (endkey === "" || endkey === null) {	//home (/)
              FORMY.Incidents = incidentList;
              endkey = 0;
              //console.log("searchResults: " + JSON.stringify(searchResults));
            }
            console.log("endkey: " + endkey);
          }});
      },
      search: function (searchTerm, department) {
        console.log("Searching for " + searchTerm + " department: " + department);
        var incidentList = new IncidentList();
        var viewOptions = {
          collection : incidentList
        };
        App.headerRegion.show(new Header());
        App.mainRegion.show(new IncidentListCompositeView(viewOptions));

        if ((searchTerm !== "") && (searchTerm !== " ")) {
          //var searchInt = parseInt(searchTerm);
          console.log("bySearchKeywords search");

          incidentList.fetch(
            {fetch: 'query',
              options: {
                query: {
                  fun:QUERIES.bySearchKeywords,
                  key:searchTerm
                }
              },
              success: function(collection, response, options) {
                console.log("item count: " + collection.length);
                FORMY.Incidents = incidentList;
//                var page = new Page({content: "Default List of Incidents:", startkey_docid:this.startkey_docid, startkey:this.startkey});
//                var Home = new HomeView(
//                  {model: page, el: $("#homePageView"), startkey_docid:this.startkey_docid, startkey:this.startkey});
              }}
          );
        } else if (department !== "") {
          console.log("Department search");

          incidentList.fetch(
            {fetch: 'query',
              options: {
                query: {
                  fun:QUERIES.byDepartment(department),
                  descending:true
                }
              },
              success: function(collection, response, options) {
                console.log("item count: " + collection.length);
                FORMY.Incidents = incidentList;
//                var page = new Page({content: "Default List of Incidents:", startkey_docid:this.startkey_docid, startkey:this.startkey});
//                var Home = new HomeView(
//                  {model: page, el: $("#homePageView"), startkey_docid:this.startkey_docid, startkey:this.startkey});
              }}
          );

        } else {
          //console.log("This should reset the collection.");
//          incidentList.db["keys"] = null;
//          incidentList.db["view"] = ["byIncidentSorted?descending=true&limit=16"];
        }
      },
      record: function (incidentId) {
        console.log("record route. incidentId: " + incidentId);
        //Set the _id and then call fetch to use the backbone connector to retrieve it from couch
        FORMY.sessionRecord = new Incident();
        FORMY.sessionRecord.id = incidentId;

        App.headerRegion.show(new Header());

        var incidentform = FORMY.forms.get("incident");
        var viewOptions = {
          model : FORMY.sessionRecord,
          template: incidentRecordTemplate
        };

        FORMY.sessionRecord.fetch( {
          success: function(model, response, options) {
            console.log("Just successfully fetched the incident.");
            console.log("record: " + JSON.stringify(FORMY.sessionRecord));
            model.set({"form": incidentform});
            model.set({"label": incidentform.get("label")});
            model.set({"recordId": model.get("_id")});
            var actionTakens = new IncidentList();
            console.log("byParentId search");
            actionTakens.fetch(
              {fetch: 'query',
                options: {
                  query: {
                    fun:QUERIES.byParentId,
                    key:FORMY.sessionRecord.id
                  }
                },
                success: function(collection, response, options) {
                  console.log("item count: " + collection.length);
                  console.log("collection: " + JSON.stringify(collection));
                  model.set({"actionTakens": actionTakens});
                  //recordView.actionTakens = actionTakens;
                  FORMY.sessionRecord.actionTakens = actionTakens;
                  var recordView = new RecordView(viewOptions);
                  recordView.currentRecord = model;
                  var actionTakenView = new ActionTakenCompositeView({ model : FORMY.sessionRecord, template: actionTakenListTemplate, collection: actionTakens });
                  var layout = new RecordActionTakenLayout();
                  layout.render();
                  App.mainRegion.show(layout);
                  layout.record.show(recordView);
                  layout.actionsTaken.show(actionTakenView);
                  $(".stripeMe tr").mouseover(function(){$(this).addClass("over");}).mouseout(function(){$(this).removeClass("over");});
                  $(".stripeMe tr:even").addClass("alt");
                }}
            );

//              }
//            });

//              },
//              error : function(){
//                console.log("Error loading PatientRecordList: " + arguments);
//              }
            //});
          }
        });
      },
      incidentForm: function(incidentId) {
        var incidentForm = FORMY.forms.get("incident");
        var incident = new Incident();
        incident.set({"form": incidentForm});
        incident.set({"label": incidentForm.get("label")});
        //actionTaken.set({"recordId": model.get("_id")});
        incident.set({"renderFormElement": "1"});

        var viewOptions = {
          model : incident,
          itemView : FormElementView,
          template: incidentRecordTemplate
        };
        var recordView = new RecordView(viewOptions);
        App.mainRegion.show(recordView);
        $(document).ready(function() {
          coconutUtils.loadCascadedSelects();
        });
      },
      actionTakenForm: function(incidentId) {
        var actionTakenForm = FORMY.forms.get("actionTaken");
        var actionTaken = new ActionTaken();
        actionTaken.set({"form": actionTakenForm});
        actionTaken.set({"label": actionTakenForm.get("label")});
        //actionTaken.set({"recordId": model.get("_id")});
        actionTaken.set({"renderFormElement": "1"});
        actionTaken.set({"parentId": incidentId});

        var viewOptions = {
          model : actionTaken,
          itemView : FormElementView,
          template: actionTakenTemplate
        };
        var recordView = new RecordView(viewOptions);
        recordView.parentId = incidentId;
        var record = new Incident({_id: recordView.parentId});
        record.fetch( {
            success: function(record){
              console.log("Fetched record: " + JSON.stringify(record));
              recordView.parentRecord = record;
            }
          }
        )
        App.mainRegion.show(recordView);
      },
      edit: function (incidentId) {
        var record = new Record({_id: incidentId});
        record.fetch( {
          success: function(model){
            console.log("Fetched record: " + JSON.stringify(model));
            var form = FORMY.forms.get("incident");
            //var actionTaken = new ActionTaken();
            record.set({"form": form});
            record.set({"label": form.get("label")});
            record.set({"renderFormElement": "1"});
            record.set({"currentRecord": record});
            var viewOptions = {
              model : record,
              itemView : FormElementView,
              template: actionTakenTemplate,
            };
            var recordView = new RecordView(viewOptions);
            App.mainRegion.show(recordView);
            $(document).ready(function() {
              coconutUtils.loadCascadedSelects();
            });
          },
          error : function(){
            console.log("Error loading Record: " + arguments);
          }
        });
      },
      editActionTaken: function (incidentId) {
        var record = new Record({_id: incidentId});
        record.fetch( {
          success: function(model){
            console.log("Fetched record: " + JSON.stringify(model));
            var incident = new Incident({_id: incidentId});
            incident.fetch( {
                success: function(model){
                  console.log("Fetched incident: " + JSON.stringify(incident));
                  //var newPatientFormView = new RecordView({model: form, el: $("#formRenderingView")});
                  var actionTakenForm = FORMY.forms.get("actionTaken");
                  var actionTaken = new ActionTaken();
                  actionTaken.set({"form": actionTakenForm});
                  actionTaken.set({"label": actionTakenForm.get("label")});
                  actionTaken.set({"renderFormElement": "1"});
                  actionTaken.set({"parentId": incidentId});
                  actionTaken.set({"currentRecord": record});
                  actionTaken.set({"parentRecord": incident});
                  var viewOptions = {
                    model : actionTaken,
                    itemView : FormElementView,
                    template: actionTakenTemplate,
                  };
                  var recordView = new RecordView(viewOptions);
                  App.mainRegion.show(recordView);
                },
                error: function(err) {
                  console.log("Error loading incident: " + err);
                }
              }
            )
          },
          error : function(){
            console.log("Error loading Record: " + arguments);
          }
        });
      },
    });
});