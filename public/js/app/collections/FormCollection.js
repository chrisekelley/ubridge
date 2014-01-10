define(['backbone','models/Form'],function(Backbone, Form) {
  'use strict';

  return Backbone.Collection.extend({
    model: Form,
    initialize: function() {
    }
  });
});
