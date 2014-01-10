define(['handlebars'], function ( Handlebars ){
  function renderPriority (priority, dateResolved) {
    var out = "";
    switch (priority){
      case "1":
        out = '<img src="img/alert-low.png" title="Low Priority">';
        break;
      case "2":
        out = '<img src="img/alert-medium.png" title="Medium Priority">';
        break;
      case "3":
        out = '<img src="img/alert-high.png" title="High Priority">';
        break;
    }
    if (dateResolved !== null) {
      out = '<img src="img/resolved.png" title="Resolved">';
    }
    return out;
  }

  Handlebars.registerHelper( 'renderPriority', renderPriority );
  return renderPriority;
});