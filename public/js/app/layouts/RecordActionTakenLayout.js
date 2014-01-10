/*global define*/

define(['backbone', 'marionette','hbs!templates/recordActionTakenLayout'],
  function (Backbone, Marionette, recordActionTakenLayout) {
    "use strict";

    return Backbone.Marionette.Layout.extend({
      template: recordActionTakenLayout,

      regions: {
        record: "#record-container",
        actionsTaken: "#actions-taken-container"
      }
    });
  });