define(['backbone','models/ActionTaken'],function(Backbone, ActionTaken) {
  'use strict';

  return Backbone.Collection.extend({
    model : ActionTaken,
	initialize: function() {
		return this;
	}, 
    db : {
		view : "byParentId"
		//changes : true,
		//keys : ["6857e31aa71f998c907d57b25e199cf2"]
	},
	url : "/actionTaken-records"
    });
});