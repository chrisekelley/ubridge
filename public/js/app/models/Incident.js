define(['backbone','collections/IncidentRecordList'],function(Backbone, IncidentRecordList){
  'use strict';

  return Backbone.Model.extend({
//    defaults: {
//      title     : '',
//      created   : 0
//    },
    initialize : function() {
      //if (this.isNew()) this.set('created', Date.now());
//      this.records =  new IncidentRecordList;
    }
  });

});

