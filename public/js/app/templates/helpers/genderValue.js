define(['handlebars'], function ( Handlebars ){
  function genderValue (value) {
    var out = "";
    if (value != null) {
      if (value === 1) {
        out = "Female";
      } else if (value === 2) {
        out = "Male";
      }
    }
    return out;
  }

  Handlebars.registerHelper( 'genderValue', genderValue );
  return genderValue;
});