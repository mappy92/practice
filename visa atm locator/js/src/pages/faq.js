define([
  'lib/vendor/publisher',
  'lib/pages/faq'
], function (publisher, faq){

  publisher.advise(faq).before('render', 'faq/render/before');

  return faq;

});
