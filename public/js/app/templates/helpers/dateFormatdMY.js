define(['handlebars', 'jqueryDateformat'], function ( Handlebars, jqueryDateformat ){
  function dateFormatdMY (value) {
    var out = "";
    if (value !== null && value !== "") {
      var d1 = new Date(value * 1000);
      out = jqueryDateformat.date(d1, "dd/MM/yyyy hh:mm:ss");
    }
    //console.log("item: " + item + " d1: " + d1 + " out: " + out);
    return out;
  }

  Handlebars.registerHelper( 'dateFormatdMY', dateFormatdMY );
  return dateFormatdMY;
});