define(['handlebars', 'jqueryDateformat'], function ( Handlebars, jqueryDateformat ){
  function dateFormatDate (item) {
    var out = "";
    var d1 = new Date(item * 1000);
    out = jqueryDateformat.date(d1, "dd/MM");
    //console.log("item: " + item + " d1: " + d1 + " out: " + out);
    return out;
  }

  Handlebars.registerHelper( 'dateFormatDate', dateFormatDate );
  return dateFormatDate;
});