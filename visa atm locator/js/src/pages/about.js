define([
  'lib/vendor/publisher',
  'lib/pages/about'
], function (publisher, about){

  publisher.advise(about).before('render', 'about/render/before');

  return about;

});
