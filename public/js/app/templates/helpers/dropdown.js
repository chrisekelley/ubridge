define(['handlebars'], function ( Handlebars ){
  function dropdown (items) {
    var out = "";
    var arry = items.split(',');
    out = out + "<option value=\"\">--Select--</option>";
    for(var i=0, l=arry.length; i<l; i++) {
      out = out + "<option value=\"" + arry[i] + "\">" + arry[i] + "</option>";
    }
    return out;
  }

  Handlebars.registerHelper( 'dropdown', dropdown );
  return dropdown;
});