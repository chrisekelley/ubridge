define(['backbone','models/Incident'],function(Backbone,Incident) {
  'use strict';

  return Backbone.Collection.extend({
    model: Incident,
    parse:function(results) {
      return _.pluck(results.rows, 'value');
    }
  });

});
