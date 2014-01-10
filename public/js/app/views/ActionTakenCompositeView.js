/*global define*/

define(['backbone', 'marionette','views/ActionTakenListItemView',
  'hbs!templates/actionTakenList','collections/ActionTakenRecordList', 'hbs!templates/hiddenWidget',
  'models/ActionTaken'],
  function (Backbone, Marionette, ActionTakenListItemView, actionTakenList, ActionTakenRecordList, hiddenWidget, ActionTaken, Record, App) {
    "use strict";

    /**
     * render the action taken items, attaching them to actionTakenList.
     */
    return Backbone.Marionette.CompositeView.extend({
      template : actionTakenList,
      itemView : ActionTakenListItemView,
      itemViewContainer : '#actionTakenList'
    });
  });