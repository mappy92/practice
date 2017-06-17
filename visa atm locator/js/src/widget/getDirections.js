define([
  'lib/vendor/publisher',
  'lib/widget/getDirections'
], function (publisher, getDirections) {

  publisher.advise(getDirections).after('handler', 'getDirections/submit');
  return getDirections;

});