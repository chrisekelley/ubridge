define(['handlebars'], function ( Handlebars ){
  function dropdownCSVValue (items, value) {
    var out = "";
    var arry = items.split(',');
    for(var i=0, l=arry.length; i<l; i++) {
      out = out + "<option value=\"" + arry[i] + "\">" + arry[i] + "</option>";
      if (arry[i] === value) {
        out = value;
      }
    }
    return out;
  }

  Handlebars.registerHelper('dropdownCSVValue', dropdownCSVValue );
  return dropdownCSVValue;
});