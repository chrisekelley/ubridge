define(['handlebars', 'jqueryDateformat'], function ( Handlebars, jqueryDateformat ){
  function dateFormat (item) {
    var out = "";
    var d1 = new Date(item * 1000);
    out = jqueryDateformat.date(d1, "dd-MM hh:mm");
    //console.log("item: " + item + " d1: " + d1 + " out: " + out);
    return out;
  }

  Handlebars.registerHelper( 'dateFormat', dateFormat );
  return dateFormat;
});