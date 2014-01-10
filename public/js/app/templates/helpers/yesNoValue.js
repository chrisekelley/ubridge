define(['handlebars'], function ( Handlebars ){
  function yesNoValue (value) {
    var out = "";
    if (value != null) {
      if (value === 1) {
        out = "Yes";
      } else if (value === 0) {
        out = "No";
      }
    }
    return out;
  }

  Handlebars.registerHelper( 'yesNoValue', yesNoValue );
  return yesNoValue;
});