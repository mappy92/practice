define([
  'lib/vendor/publisher',
  'lib/widget/toggles'
], function (publisher, toggles){

  function defineFilter (page){
    page.defineFilter('toggles', jQuery.proxy(toggles, 'create'));
  }

  publisher.subscribe({
    'about/render/before': defineFilter,
    'faq/render/before': defineFilter
  });

  return toggles;

});
