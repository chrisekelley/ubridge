define(['handlebars'], function ( Handlebars ){
  function dropdownValue (enumerations, value) {
    var out = "";
    for (fenum in enumerations) {
      var record = enumerations[fenum];
      //console.log("defaultValue: " + record.defaultValue + " value: " + value);
      // Assuming that defaultValue is always a string, but value may be a number.
      if (record.defaultValue === value.toString()) {
        out = record.label;
      }
    }
    return out;
  }

  Handlebars.registerHelper( 'dropdownValue', dropdownValue );
  return dropdownValue;
});