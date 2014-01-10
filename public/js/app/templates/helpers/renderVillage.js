define(['handlebars', 'FORMY'], function ( Handlebars, FORMY ){
  function renderVillage (value) {
    var out = FORMY.village[value];
    return out;
  }

  Handlebars.registerHelper( 'renderVillage', renderVillage );
  return renderVillage;
});