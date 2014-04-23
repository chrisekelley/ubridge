// Include Desktop Specific JavaScript files here (or inside of your Desktop Controller, or differentiate based off App.mobile === false)
require(["App", "routers/AppRouter", "controllers/DesktopController", "jquery", "backbone", "marionette", "jqueryui", "bootstrap", "backbone.validateAll"],
    function (App, AppRouter, AppController) {
        App.appRouter = new AppRouter({
            controller:new AppController()
        });
//      App.appRouter.controller.listenTo(App.appRouter.controller, "stuff:done", function(stuff){
//        console.log(stuff);
//      });
        // Start Marionette Application in desktop mode (default)
        App.start();

    });