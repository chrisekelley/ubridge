/*global $*/

    define(['jquery', 'backbone', 'marionette', 'underscore', 'handlebars', 'BackbonePouch', 'PouchDB' ,
        'collections/FormCollection','form_defs/incidentForm', 'form_defs/actionTakenForm', 'models/Form', 'FORMY',
        'models/SyncStatus', 'coconutUtils'],
    function ($, Backbone, Marionette, _, Handlebars, BackbonePouch, PouchDB, FormCollection, incidentForm, actionTakenForm,
              Form, FORMY, SyncStatus, coconutUtils) {
        var App = new Backbone.Marionette.Application();
          //incidentList = new IncidentList();

        function isMobile() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
        }

        //Organize Application into regions corresponding to DOM elements
        //Regions can contain views, Layouts, or subregions nested as necessary
        App.addRegions({
            headerRegion:"header",
            mainRegion:"#main"
        });

        App.addInitializer(function () {
//          var viewOptions = {
//            collection : incidentList
//          };

          //app.header.show(new Header(viewOptions));
//          App.incidentsRegion.show(new IncidentListCompositeView(viewOptions));

//          incidentList.fetch();
            Backbone.history.start();
        });

        App.mobile = isMobile();

      //var FORMY = {};
      FORMY.forms = new FormCollection();

      App.on("contacts:list", function(){
         App.navigate("contacts");
         API.listContacts();
         });

      App.on("incidentForm", function(id){
          App.navigate('incidentForm');
          App.appRouter.options.controller.incidentForm(id)
      });

      App.on("index", function(id){
          App.navigate('');
          App.appRouter.options.controller.index();
      });

      var incidentJson = incidentForm;
      var incident = new Form(incidentJson);
      FORMY.forms.add(incident);
      var formElements = incident.get("form_elements");
      FORMY.village = [];
      for (var i = 0; i < formElements.length; i++) {
        var formElement = formElements[i];
        if (formElement.identifier == "village") {
          var enumerations = formElement.enumerations;
          for (var j = 0; j < enumerations.length; j++) {
            var enumeration = enumerations[j];
            var value = enumeration.defaultValue;
            var label = enumeration.label;
            FORMY.village[value] = label;
            //console.log("FORMY.village[value]:" + FORMY.village[value]);
          }
          //console.log("formElement: " + JSON.stringify(formElements[i]));
        }
      }

      var actionTaken = new Form(actionTakenForm);
      FORMY.forms.add(actionTaken);
      /** Configure the database **/

      var ua = navigator.userAgent;
      if( ua.indexOf("Android") >= 0 )
      {
        var is412 = ua.indexOf("4.1.2");
        var isGTP6200 = ua.indexOf("GT-P6200");
        console.log("is412: " + is412 + " isGTP6200:" + isGTP6200);
        if ((is412) && (isGTP6200))
        {
          console.log("forcing websql.");
          Backbone.sync = BackbonePouch.sync({
            db: PouchDB('websql://troubletickets')
          });
        } else {
          console.log("Letting Pouch decide the preferred adapter.");
          Backbone.sync = BackbonePouch.sync({
            db: PouchDB('troubletickets')
          });
        }
      } else {
        console.log("Letting Pouch decide the preferred adapter.");
        Backbone.sync = BackbonePouch.sync({
          db: PouchDB('troubletickets')
        });
      }

      Backbone.Model.prototype.idAttribute = '_id';

      var onComplete = function(err, result) {
        if (result.ok) {
          console.log("Replication is fine. ");
        } else {
          console.log("err: " + JSON.stringify(err));
        }
      };

      //If set to true, the connector will listen to the changes feed
      //and will provide your models with real time remote updates.
      //But in this case we enable the changes feed for each Collection on our own.
      //Backbone.couch_connector.config.global_changes = false;

      //This allows us to have separate template files
      var loadTemplate = function(filename){
        //console.log("filename in config: " + filename);
        var templateFunction;
        $.ajax("app/templates/" + filename,{
          async:false, // make sure we pause execution until this template is loaded
          success: function(result){
            //console.log("result: " + result);
            templateFunction = Handlebars.compile(result);
          }
        });
        // console.log("templateFunction: " + templateFunction);
        return templateFunction;
      };

      //This allows us to have a single file for template widgets.

      $.ajax("/js/app/templates/templates.html",{
        dataType: "html",
        async:false, // make sure we pause execution until this template is loaded
        success: function(result){
          //console.log("loaded templates.html: " + result);
          $("head").append(result);
        },
        error: function(error){
          console.log("Error loaded templates.html: " + JSON.stringify(error));
        }
      });

      FORMY.ReplicationStarted = null;
      FORMY.SyncStatus = new SyncStatus();
      var account = coconutUtils.getLoginPreferences();
      coconutUtils.StartReplication(account);
     // UrbanAirshipRegistration(account);

        return App;

    });

