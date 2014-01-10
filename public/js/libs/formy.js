define(['backbone','models/Form'],function(Backbone, Form) {
  'use strict';

  var FORMY = {};

  FORMY.loadForm = function(name, parentId, options) {
    options || (options = {});
    var form = new Form({_id: name});
    form = FORMY.forms.get(name);
    form.parentId = parentId;
    console.log("fetched from FORMY: " + name + "; parentId: " + parentId);
    var success = options.success;
    if (success) {
      success(form);
    }
  };

  return FORMY;
});