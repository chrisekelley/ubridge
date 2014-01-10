require.config({
  baseUrl:"./js/app",
  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths:{
    // Core Libraries
    "jquery":"../libs/jquery",
    "jqueryui":"../libs/jqueryui",
    "jquerymobile":"../libs/jquery.mobile",
    "underscore":"../libs/lodash",
    "backbone":"../libs/backbone",
    "marionette":"../libs/backbone.marionette",
    "handlebars":"../libs/handlebars",
    "hbs":"../libs/hbs",
    "i18nprecompile":"../libs/i18nprecompile",
    "json2":"../libs/json2",
    "jasmine": "../libs/jasmine",
    "jasmine-html": "../libs/jasmine-html",
    "BackbonePouch": "../libs/backbone-pouch",
    "PouchDB": "../libs/pouchdb-nightly",
    "inflection": "../libs/inflection",

    // Plugins
    "backbone.validateAll":"../libs/plugins/Backbone.validateAll",
    "bootstrap":"../libs/plugins/bootstrap",
    "text":"../libs/plugins/text",
    "jasminejquery": "../libs/plugins/jasmine-jquery",

    // UBridge
    "FORMY": "../libs/formy",
    "jqueryDateformat": "../libs/jquery.dateFormat-1.0",
    "coconutUtils": "../libs/coconut-utils",
    "toObject": "../libs/plugins/jquery.toObject",
    "form2object": "../libs/form2object",
    "QUERIES": "../app/query/pouchdb_views"
  },
  // Sets the configuration for your third party scripts that are not AMD compatible
  shim:{
    // Twitter Bootstrap jQuery plugins
    "bootstrap":["jquery"],
    // jQueryUI
    "jqueryui":["jquery"],
    // jQuery mobile
    "jquerymobile":["jqueryui"],

    // Backbone
    "backbone":{
      // Depends on underscore/lodash and jQuery
      "deps":["underscore", "jquery"],
      // Exports the global window.Backbone object
      "exports":"Backbone"
    },
    //Marionette
    "marionette":{
      "deps":["underscore", "backbone", "jquery"],
      "exports":"Marionette"
    },
    //Handlebars
    "handlebars":{
      "exports":"Handlebars"
    },
    // Backbone.validateAll plugin that depends on Backbone
    "backbone.validateAll":["backbone"],

    "jasmine": {
      // Exports the global 'window.jasmine' object
      "exports": "jasmine"
    },

    "jasmine-html": {
      "deps": ["jasmine"],
      "exports": "jasmine"
    },

    "BackbonePouch": {
      "deps":["backbone", "PouchDB"],
      "exports":"BackbonePouch"
    },

    "PouchDB": {
      "deps":["backbone"],
      "exports":"PouchDB"
    },

    "jqueryDateformat": {
      deps: [ 'jquery' ],
      exports: 'jQuery.format'
    },

    "inflection": {
      exports: 'inflection'
    },

    "toObject": {
      deps: [ 'jquery', 'form2object' ],
      exports: 'jQuery.toObject'
    },

    form2object: {exports: 'form2object'}

  },
  // hbs config - must duplicate in Gruntfile.js Require build
  hbs: {
    templateExtension: "html",
    helperDirectory: "templates/helpers/",
    i18nDirectory: "templates/i18n/",

    compileOptions: {}        // options object which is passed to Handlebars compiler
  }
});