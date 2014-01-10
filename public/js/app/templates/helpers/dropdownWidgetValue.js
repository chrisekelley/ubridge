define(['handlebars'], function ( Handlebars ){
  function dropdownWidgetValue (enumerations, value) {
    var out = "";
    out = out + "<option value=\"\">--Select--</option>";
    //console.log("sorting");
    enumerations.sort(sortBylabelAlpha);
    for (fenum in enumerations) {
      var record = enumerations[fenum];
      if (record.defaultValue === value.toString()) {
        out = out + "<option value=\"" + record.defaultValue + "\" selected=\"selected\"";
      } else {
        out = out + "<option value=\"" + record.defaultValue + "\"";
      }
      if (record.parent_id != null) {
        out = out + " class = \"sub_" + record.parent_id + "\"";
      }
      out = out + ">" + record.label + "</option>";
    }
    return out;
  }
  function sortBylabelAlpha(a,b) {
    return a.label.toLowerCase() > b.label.toLowerCase();
  }

  Handlebars.registerHelper( 'dropdownWidgetValue', dropdownWidgetValue );
  return dropdownWidgetValue;
});