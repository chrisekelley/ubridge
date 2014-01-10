define(['backbone', 'marionette'], function(Backbone, Marionette) {
  return Backbone.Marionette.AppRouter.extend({
    //"index" must be a method in AppRouter's controller
    appRoutes: {
      "":                                       "index",
      "home/:endkey":                           "index",
      "search/:query":        						      "search",    		          // #search
      "search/:query/:department":        			"search",    		          // #search
      "incidentForm":           							  "incidentForm",    		    // #incidentForm
      "record/:incidentId":					            "record",                 // #record
      "actionTakenForm/:incidentId":           	"actionTakenForm",    		// #actionTaken
      "editActionTaken/:recordId":          		"editActionTaken",   			// #editActionTaken
      "edit/:recordId":          						    "edit"   			            // #edit
    }
  });
});