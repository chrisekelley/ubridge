define( ['App', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/welcome'],
    function(App, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
          initialize: function() {
            console.log("HomeView initialize");
            this.alertMessage = this.$('alertMessage');

            // bind the model change to re-render this view
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(FORMY.Incidents, 'add', this.addOne);
            this.listenTo(FORMY.Incidents, 'reset', this.addAll);
            this.listenTo(FORMY.Incidents, 'all', this.render);
            this.listenTo(FORMY.SyncStatus, 'all', this.render);
          },
            template: template,
            model: new Model({
                mobile: App.mobile
            }),

            // View Event Handlers
            events: {

            },
            render: function() {
            //		$("#formRenderingView").remove();
            //		$("#recordView").remove();
            //console.log("render in HomeView:" + JSON.stringify(this.model));
            //this.content = this.model.toJSON();
            console.log("HomeView render.");
            var limit = 16;
            //this.template =  loadTemplate("home.vert.template.html");
            this.html = this.template(this.model.toJSON());
            //$(this.el).html(homeViewHtml);
            //$("body").html(homeViewHtml);
            //if(FORMY.Incidents.length > 0){
            FORMY.Incidents.each(this.addOne);
            console.log("Looped through the Incidents");
            //		$(".stripeMe tr").mouseover(function(){$(this).addClass("over");}).mouseout(function(){$(this).removeClass("over");});
            //		$(".stripeMe tr:even").addClass("alt");
            //    console.log("Applied .stripeME to tr's.")
            this.alertMessage.show();
            console.log("FORMY.SyncStatus.html: " + FORMY.SyncStatus.html);
            //this.alertMessage.html(FORMY.SyncStatus.html);
            $("#alertMessage").html(FORMY.SyncStatus.html);
            return this;
          },
          addOne : function(record){
            if ((record.attributes.type !== null) && (record.attributes.type === "incident")) {
              var view = new SearchListItemView({model: record});
              //this.rendered = this.view.render().el;
              //console.log("add one in HomeView:" + JSON.stringify(record));
              this.$("#incidents").append(view.render().el);
            } else {
              console.log("Skipping this record - not an incident.");
            }
          }
        });
    });