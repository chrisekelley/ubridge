// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "models/Model", "collections/Collection", "views/WelcomeView","views/DesktopHeaderView",
  "views/MobileHeaderView","views/IncidentListCompositeView", "collections/IncidentList", "models/Incident"],
  function($, Backbone, Marionette, Model, Collection, WelcomeView, DesktopHeaderView, MobileHeaderView, IncidentListCompositeView,
           IncidentList, Incident) {
    // Test suite that includes all of the Jasmine unit tests
    describe("UBridge (MRB)", function() {
      /*// Marionette App Suite: contains all tests related to views
       describe("Desktop Marionette App instantiation", function() {
       //Initialize App in Desktop Mode (App is global var)
       App.start();
       it("App should start and have Regions", function() {
       expect(App.mainRegion.el).toEqual("#main");
       expect(App.headerRegion.el).toEqual("header");
       });

       }); // End of the App test suite*/

      // Marionette View Suite: contains all tests related to views
      describe("Marionette Views", function() {
        it("Instantiate some Views", function() {
          var container = $("#container");
//                    var welcomeView = new WelcomeView();
//                    container.append(welcomeView.render().$el);

          var desktopHeaderView = new DesktopHeaderView();
          container.append(desktopHeaderView.render().$el);

          var mobileHeaderView = new MobileHeaderView();
          container.append(mobileHeaderView.render().$el);

          incidentList = new IncidentList();
          var viewOptions = {
            collection : incidentList
          };
          var incidentListCompositeView = new IncidentListCompositeView(viewOptions);
          container.append(incidentListCompositeView.render().$el);

        });
      }); // End of the View test suite*/

//          kudos: http://stackoverflow.com/a/15315438


      describe("Create a record", function() {

        beforeEach(function(){
          var done = false;
          runs( function(){
//                var delRequest = indexedDB.deleteDatabase("_pouch_troubletickets");
//                delRequest.onsuccess = function( event ){
//                  console.log("DB Deleted");
//
//                  setupDB()
//                    .then(function(db){
//                      console.log("DB Setup with stores: ", db.objectStoreNames );
//                      done = true;
//                    })
//                };
//                delRequest.onerror = function(event){
//                  console.log("DB Err: ", event );
//                  done = true;
//                };
            setupDB()
              .then(function(db){
                console.log("DB Setup.");
                done = true;
              })
          });
          waitsFor( function(){ return done; }, "Database never created..", 10000 );
        });

        it("should create a record", function() {
          var done = false;

          runs(function() {

            var unixTimestamp = Math.round(+new Date() / 1000);
            var created = unixTimestamp;
            var lastModified = created;
            var ct = 1;
            var id = "test" + ct + "_" + created;

            //var incident = generateTestIncident(ct, id)

            var testdoc = populateTestIncident(id, ct);
            //db.saveDoc(testdoc, opts);
            var incident = new Incident(testdoc);
            incident.save(null, {success: function(model, response, options){
              console.log("saved: " + JSON.stringify(model));
              expect( model.get("_rev") ).not.toBe(null);
              done = true;
            }});
            console.log("incident: " + JSON.stringify(incident));
          });
        });
      });

      describe("View a record", function() {

        var done = false;

        var unixTimestamp = Math.round(+new Date() / 1000);
        var created = unixTimestamp;
        var lastModified = created;
        var ct = 1;
        var id = "test" + ct + "_" + created;

        beforeEach(function(){
          var done = false;
          runs( function(){


            setupDBPopulate(id)
              .then(function(db){
                console.log("DB Setup.");
                done = true;
              })
          });
          waitsFor( function(){ return done; }, "Database never created..", 10000 );
        });

        it("should fetch a record", function() {

          var done = false;

          runs(function() {
            var record = new Incident();
            record.id = id;
            record.fetch( {
              success: function(model, response, options) {
                done = true;
                console.log("Just successfully fetched the incident.");
                console.log("record: " + JSON.stringify(model));
              }
            });
          });

          waitsFor(function(){ return done; }, "Didn't get record", 5000 );

        });
      });

      // Backbone Model Suite: contains all tests related to models
      describe("Backbone models", function() {

        // Runs before every Model spec
        beforeEach(function() {
          // Instantiates a new Model instance
          this.model = new Model();

          // We are spying on the _validate method to see if it gets called
          spyOn(Model.prototype, "validate").andCallThrough();
        });

        it("should be in a valid state", function() {
          expect(this.model.isValid()).toBe(true);
        });

        it("should call the validate method when setting a property", function() {
          this.model.set({ example: "test" }, { validate: true });
          expect(Model.prototype.validate).toHaveBeenCalled();
        });

      }); // End of the Model test suite

      // Backbone Collection Suite: contains all tests related to collections
      describe("Backbone collections", function() {
        // Runs before every Collection spec
        beforeEach(function() {
          // Instantiates a new Collection instance
          this.collection = new Collection();
        });

        it("should contain the correct number of models", function() {
          expect(this.collection.length).toEqual(0);
        });

      }); // End of the Collection test suite
    }); // End of the MRB test suite


    function setupDB(){

      var dbRequest = window.indexedDB.open("_pouch_troubletickets"),
        dbDfd = $.Deferred();

      dbRequest.onsuccess = function( event ) {
        console.log("Opened DB");
        db = dbRequest.result;
        dbDfd.resolve( db );
      };
      dbRequest.onblocked = function( event ){
        console.error("DB connection blocked");
        db.close();
        setupDB();
      };
      dbRequest.onerror = function( event ){
        console.error("DB connection issues");
        dbDfd.reject();
      };
      dbRequest.onupgradeneeded = function(){
        var i, cur;
        db = dbRequest.result;
        console.log("onupgradeneeded");

        //Create non-existant tables
//                for(i=0; i < stores.length; i+=1){
//                  cur = stores[i];
//                  db.createObjectStore( cur.name,  {keyPath: cur.keyPath, autoIncrement: true});
//                }
      };
      return dbDfd.promise();
    }

    function setupDBPopulate(id){

      var dbRequest = window.indexedDB.open("_pouch_troubletickets"),
        dbDfd = $.Deferred();

      dbRequest.onsuccess = function( event ) {
        console.log("Opened DB");

        //var incident = generateTestIncident(ct, id)

        var testdoc = populateTestIncident(id, 1);
        //db.saveDoc(testdoc, opts);
        var incident = new Incident(testdoc);
        incident.save(null, {success: function(model, response, options){
          console.log("saved: " + JSON.stringify(model));
          expect( model.get("_rev") ).not.toBe(null);
        }});
        console.log("incident: " + JSON.stringify(incident));

        db = dbRequest.result;
        dbDfd.resolve( db );
      };
      dbRequest.onblocked = function( event ){
        console.error("DB connection blocked");
        db.close();
        setupDB();
      };
      dbRequest.onerror = function( event ){
        console.error("DB connection issues");
        dbDfd.reject();
      };
      dbRequest.onupgradeneeded = function(){
        var i, cur;
        db = dbRequest.result;
        console.log("onupgradeneeded");

        //Create non-existant tables
//                for(i=0; i < stores.length; i+=1){
//                  cur = stores[i];
//                  db.createObjectStore( cur.name,  {keyPath: cur.keyPath, autoIncrement: true});
//                }
      };
      return dbDfd.promise();
    }

    function populateTestIncident(id, ct, testdoc) {
      //var subcounty=randomFromTo(1,8).toString();
      var subcounty = 3;
      //var village=randomFromTo(1,180).toString();
      var village = 122;
      var priority = randomFromTo(1, 3).toString();
      var department = randomFromTo(1, 6).toString();
      var resolved = randomFromTo(0, 1).toString();
      var month = randomFromTo(1, 10);
      var day = randomFromTo(1, 31);
      switch (month) {
        case 10:
          day = randomFromTo(1, 11);
          break;
        case 9:
          day = randomFromTo(1, 30);
          break;
        case 4:
          day = randomFromTo(1, 30);
          break;
        case 2:
          day = randomFromTo(1, 27);
          break;
        case 6:
          day = randomFromTo(1, 30);
          break;
        case 11:
          day = randomFromTo(1, 30);
          break;
        default:
          day = randomFromTo(1, 31);
          break;
      }
      var unixTimestamp = Math.round(+new Date() / 1000);
      var created = unixTimestamp;
      var lastModified = created;

      //var id =  "test" + ct;
      if (id === null) {
        id = "test" + ct + "_" + created;
      }

      testdoc = { _id: id, "flowId": "300", "formId": "incident", "phone": "0772555" + ct, "description": "This is a test",
        "subcounty": subcounty, "village": village, "priority": priority, "department": department, "assignedId": ct.toString(),
        "resolved": resolved, "created": created, "lastModified": lastModified, "createdBy": "test", "type": "incident",
        "dep_administration": "1"};

      return testdoc;
    }


    function randomFromTo(from, to){
      return Math.floor(Math.random() * (to - from + 1) + from);
    };

  });
