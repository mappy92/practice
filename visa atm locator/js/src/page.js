define([
  'lib/vendor/publisher',
  'lib/page',
  'src/appData'
], function (publisher, page, appData){

  page.locals.appData = appData;

  publisher.subscribe('search/success', function (search, data){
    page.locals.searchResults = data;
  });

  return page;

});
