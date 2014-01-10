define(['backbone', 'collections/ActionTakenRecordList'],function(Backbone, ActionTakenRecordList){
  'use strict';

  return Backbone.Model.extend({
    initialize : function(){
    	//console.log("init Incident: ");
    	this.records =  new ActionTakenRecordList;
    }
  });
});