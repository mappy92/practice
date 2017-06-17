define([
  'lib/vendor/publisher',
  'lib/widget/sort'
], function (publisher, sort){
  publisher.advise(sort).after('setSort', 'sort/click');
  return sort;
});