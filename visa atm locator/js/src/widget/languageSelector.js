define([
  'lib/vendor/publisher',
  'lib/widget/languageSelector'
], function (publisher, languageSelector){

  languageSelector['layout/before/init'] = function (layout){
    layout.defineFilter('language', jQuery.proxy(this, 'init'));
  };

  publisher.subscribe('layout/before/init', languageSelector);

});
