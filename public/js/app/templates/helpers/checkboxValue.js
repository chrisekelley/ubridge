define(['handlebars'], function ( Handlebars ){
  function checkboxValue (value) {
    var out = "";
    if (value != null) {
      if (value === "1") {
        out = "Yes";
      } else if (value === "0") {
        out = "No";
      }
    }
    return out;
  }

  Handlebars.registerHelper( 'checkboxValue', checkboxValue );
  return checkboxValue;
});